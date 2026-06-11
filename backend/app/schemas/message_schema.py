from pydantic import BaseModel


class MessageCreate(
    BaseModel
):

    title: str

    message: str

    class_name: str