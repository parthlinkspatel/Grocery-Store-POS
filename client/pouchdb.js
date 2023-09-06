class Database {
    constructor(dbName) {
      this.db = new PouchDB(dbName);
    }
  
    create(doc) {
      // Inserts a new document into the database
      return this.db.put(doc);
    }
  
    read(docId) {
      // Retrieves a document from the database by its ID
      return this.db.get(docId);
    }
  
    update(doc) {
      // Updates an existing document in the database
      return this.db.put(doc);
    }
  
    delete(doc) {
      // Deletes a document from the database
      return this.db.remove(doc);
    }
  }