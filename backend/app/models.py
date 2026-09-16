def format_mongo_id(doc: dict) -> dict:
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
    return doc

def clean_expense_doc(doc: dict) -> dict:
    if doc:
        doc.pop("_id", None)
    return doc
