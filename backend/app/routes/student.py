from fastapi import UploadFile
from fastapi import File
import shutil
import os
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from datetime import datetime
from datetime import timedelta
import uuid

from app.models.admin_log import AdminLog

from sqlalchemy import Date

from fastapi import HTTPException

from sqlalchemy.orm import relationship

from app.database import get_db
from app.models.student import Student
from app.schemas.student_schema import (
    StudentCreate,
    StudentUpdate,
    StudentLogin,
    PasswordChange,
    StudentResponse
)
from app.security.auth_bearer import (
    verify_token,
    admin_required,
    student_required
)
from app.security.hashing import (
    hash_password,
    verify_password
)

from app.security.jwt_handler import (
    create_access_token
)

from app.services.student_service import (
    get_student_by_phone,
    get_student_by_id
)


router = APIRouter(
    prefix="/student",
    tags=["Student"]
)


@router.post("/add")
def add_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    try:
        existing_phone = get_student_by_phone(
            db,
            student.phone

        )                                                   

        generated_student_id = (
            "VANI-" +
            str(uuid.uuid4())[:8]
        )

        default_password = "123456"

        if len(student.name) < 3:
            return {
                 "message":
                 "Name too short"
            }
        if len(student.phone) != 10:
             return {
                  "message":
                   "Phone must be 10 digits"
                }

        new_student = Student(
            student_id=generated_student_id,
            name=student.name,
            father_name=student.father_name,
            phone=student.phone,
            class_name=student.class_name,
            school_name=student.school_name,
            joining_date=datetime.strptime(
                student.joining_date,
                "%Y-%m-%d"
            ).date(),
            address=student.address,
            profile_image="",
            hashed_password=hash_password(
                default_password
            ),
            must_change_password=True
        )

        db.add(new_student)
        db.commit()
        db.refresh(new_student)

        log = AdminLog(
            action=f"Added student {student.name}"
        )

        db.add(log)
        db.commit()

        return {
            "message": "Student Added Successfully",
            "student_id": generated_student_id,
            "default_password": default_password
        }

    except Exception as e:
        return {
            "error": str(e)
        }
    

@router.get("/students",
            response_model=dict)
def get_all_students(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    admin=Depends(
        admin_required
    )
):

    skip = (
        (page - 1)
        * limit
    )

    students = db.query(
        Student
    ).offset(
        skip
    ).limit(
        limit
    ).all()

    total_students = db.query(
        Student
    ).count()

    return {
        "page": page,
        "limit": limit,
        "total_students":
        total_students,
        "students":
        students
    }






@router.get("/class/{class_name}",
            response_model=list[StudentResponse]
            )
def class_wise_students(
    class_name: str,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):
    students = db.query(
        Student
    ).filter(
        Student.class_name == class_name
    ).all()

    return students

@router.put("/update/{student_id}")
def update_student(
    student_id: int,
    updated_student: StudentUpdate,
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    student = get_student_by_id(
        db,
        student_id
    )
        
    
    

    if not student:
        return {
            "message": "Student not found"
        }
    print(updated_student.dict())
    
    existing_phone = db.query(
        Student
    ).filter(
        Student.phone ==
        updated_student.phone,
        Student.id != student_id
    ).first()

    print(
        "PHONE:",
        student.phone
    )
  
         

    student.name = updated_student.name
    student.father_name = updated_student.father_name
    student.phone = updated_student.phone
    student.class_name = updated_student.class_name
    student.school_name = updated_student.school_name
    student.address = updated_student.address

    if updated_student.joining_date:
        student.joining_date = datetime.strptime(
            updated_student.joining_date,
            "%Y-%m-%d"
        ).date()

    
        
        
    

    db.commit()

    return {
        "message": "Student Updated Successfully"
    }





from app.models.attendance import Attendance
from app.models.fees import Fees
from app.models.marks import Marks

@router.delete("/delete/{student_id}")
def delete_student(

    student_id: int,

    db: Session = Depends(get_db),

    admin=Depends(admin_required)

):

    student = db.query(
        Student
    ).filter(
        Student.id == student_id
    ).first()

    if not student:

        return {
            "message":
            "Student not found"
        }

    db.query(
        Attendance
    ).filter(
        Attendance.student_id
        ==
        student_id
    ).delete()

    db.query(
        Fees
    ).filter(
        Fees.student_id
        ==
        student_id
    ).delete()

    db.query(
        Marks
    ).filter(
        Marks.student_id
        ==
        student_id
    ).delete()

    student_name = student.name
    
    db.delete(student)

    db.commit()

    log = AdminLog(
        action = f"Deleted Student {student.name}"
    )
    db.add(log)
    db.commit()

    return {

        "message":
        "Student Deleted Successfully"
    }


@router.post("/login")
def student_login(
    student: StudentLogin,
    db: Session = Depends(get_db)
):

    db_student = db.query(
        Student
    ).filter(
        Student.student_id ==
        student.student_id
    ).first()

    if not db_student:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    if (
        db_student.locked_until
        and
        db_student.locked_until >
        datetime.utcnow()
    ):

        raise HTTPException(
            status_code=403,
            detail=
            "Account locked. Try again after 15 minutes."
        )

    password_match = verify_password(
        student.password,
        db_student.hashed_password
    )

    if not password_match:

        db_student.failed_attempts += 1

        if db_student.failed_attempts >= 5:

            db_student.locked_until = (
                datetime.utcnow()
                +
                timedelta(minutes=15)
            )

        db.commit()

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    db_student.failed_attempts = 0
    db_student.locked_until = None

    db.commit()

    token = create_access_token(
        {
            "sub": str(
                db_student.id
            ),
            "role": "student"
        }
    )
    print(
        "must_change_password=",
        db_student.must_change_password
    )

    if db_student.must_change_password:
        print("must change password block hit")

        return {
            "must_change_password": True,
            "access_token": token,
            "message":
            "Please change your password first"
        }

    return {

        "access_token":
        token,

        "token_type":
        "bearer",

        "must_change_password":
        False
    }



@router.get("/profile")
def student_profile(
    student_data=Depends(student_required),
    db: Session = Depends(get_db)
):

    student_id = student_data.get("sub")
    
    

    student = db.query(
        Student
    ).filter(
        Student.id ==
        int(student_id)
    ).first()
    

    if not student:
        return {
            "message": "Student not found"
        }

    return {
        "student_id": student.student_id,
        "name": student.name,
        "father_name": student.father_name,
        "phone": student.phone,
        "class_name": student.class_name,
        "school_name": student.school_name,
        "joining_date": str(student.joining_date),
        "address": student.address
    }

@router.post("/upload-profile")
def upload_profile_image(
    file: UploadFile = File(...),
    student_data=Depends(
        student_required
    ),
    db: Session = Depends(get_db)
):

    student_id = student_data.get(
        "sub"
    )

    student = db.query(
        Student
    ).filter(
        Student.id ==
        int(student_id)
    ).first()

    if not student:
        return {
            "message":
            "Student not found"
        }

    os.makedirs(
        "uploads/profiles",
        exist_ok=True
    )

    filename = (
        f"{uuid.uuid4()}_{file.filename}"
        
    )

    file_path = (
        f"uploads/profiles/"
        f"{filename}"
    )

    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    student.profile_image = (
        file_path
    )




    db.commit()

    return {
        "message":
        "Profile Uploaded Successfully",
        "profile_image":
        file_path
    }



@router.put("/change-password")
def change_password(
    data: PasswordChange,
    student_data=Depends(
        student_required
    ),
    db: Session = Depends(get_db)
):

    student_id = student_data.get(
        "sub"
    )

    student = db.query(
        Student
    ).filter(
        Student.id ==
        int(student_id)
    ).first()

    if not student:
        return {
            "message":
            "Student not found"
        }

    password_match = verify_password(
        data.old_password,
        student.hashed_password
    )

    if not password_match:
        return {
            "message":
            "Old password incorrect"
        }

    student.hashed_password = (
        hash_password(
            data.new_password
        )
    )
    student.must_change_password=False
    print("before commit=",student.must_change_password)

    db.commit()

    db.refresh(student)
    print(
        "after commit=",
        student.must_change_password
    )

    return {
        "message":
        "Password Changed Successfully"
    }

@router.get("/search",
            response_model=list[StudentResponse]
            )
def search_students(
    name: str = "",
    student_id: str = "",
    phone: str = "",
    class_name: str = "",
    db: Session = Depends(get_db),
    admin=Depends(admin_required)
):

    students_query = db.query(
        Student
    )

    if name != "":
        students_query = (
            students_query.filter(
                Student.name.ilike(
                    f"%{name}%"
                )
            )
        )

    if student_id != "":
        students_query = (
            students_query.filter(
                Student.student_id
                == student_id
            )
        )

    if phone != "":
        students_query = (
            students_query.filter(
                Student.phone
                == phone
            )
        )

    if class_name != "":
        students_query = (
            students_query.filter(
                Student.class_name
                == class_name
            )
        )

    students = (
        students_query.all()
    )

    return students

@router.get("/me")
def get_my_profile(

    student=Depends(student_required),

    db: Session = Depends(get_db)

):

    

    current_student = db.query(
        Student
    ).filter(
        Student.id
        ==
        int(student["sub"])
    ).first()

    if not current_student:
        return{
            "message":
            "Student not found"
        }

    

    return current_student

@router.get("/students-by-class")
def students_by_class(

    db: Session = Depends(get_db),

    admin=Depends(admin_required)

):

    students = db.query(
        Student
    ).all()

    result = {}

    for student in students:

        class_name = student.class_name

        if class_name not in result:

            result[class_name] = []

        result[class_name].append({

            "id":student.id,

            "student_id":
            student.student_id,

            "name":
            student.name,

            "phone":
            student.phone

        })

    return result


@router.get("/details/{student_id}")
def get_student(

    student_id: int,

    db: Session = Depends(get_db),

    admin=Depends(admin_required)

):

    student = db.query(
        Student
    ).filter(
        Student.id == student_id
    ).first()

    if not student:

        return {
            "message":
            "Student not found"
        }

    return student