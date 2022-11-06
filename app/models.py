#########################
###### Imports ######
#########################
import sqlite3
import os
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras as ext
#########################
###### Imports END ######
#########################


#####################
###### Configs ######
#####################
DATABASE_URL = os.environ.get('DATABASE_URL')
#########################
###### Configs END ######
#########################

####################
###### Models ######
####################
class StudentsTable:

    def __init__(self):
        self.conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        #self.conn = sqlite3.connect("spdb.db")
        self.cur = self.conn.cursor(cursor_factory=ext.DictCursor)
        self.cur.execute("""

                CREATE TABLE IF NOT EXISTS students
                    (
                        id         INTEGER NOT NULL,
                        name       TEXT NOT NULL,
                        partsTotal TEXT NOT NULL
                    ) 
                            
                        """)

    def display(self):
        self.cur.execute("""

                SELECT * 
                FROM students
                        
                        """)
        self.records = self.cur.fetchall()
        return self.records

    def search(self, id):
        self.cur.execute(f"""

                SELECT * 
                FROM students 
                WHERE id = '{id}'

                        """)
        self.record = self.cur.fetchone()
        return self.record


    def insert(self, id, name, totalParts):
        print(id, f"{name, totalParts}")
        if (id == "" or name == "" or totalParts):
            raise Exception("One of the entries is empty")
        self.cur.execute(f"""

                INSERT INTO students
                            (
                                id,
                                name,
                                totalParts
                            )
                VALUES
                            {( 
                                id , 
                                name, 
                                totalParts
                            )};

                        """)
        self.conn.commit()

    def update(self, id, name, totalParts):
        self.cur.execute(f"""

                UPDATE students 
                SET title = '{name}' 
                WHERE id = '{id}'
                        
                        """)
        self.cur.execute(f"""

                UPDATE students 
                SET price = '{totalParts}' 
                WHERE id = '{id}'

                        """)
        self.conn.commit()
    

    def updateImage(self, id, img):
        print("yes it does run")
        self.cur.execute(f"""

                UPDATE products 
                SET img = '{img}' 
                WHERE id = '{id}'

                        """)
        self.conn.commit()

    def delete(self, id):
        if (id == None):
            raise Exception("You have to select an id to delete its values")
        self.cur.execute(f"""
            
                DELETE FROM students 
                WHERE id = '{id}'
            
                        """)
        self.conn.commit()

    def __del__(self):
        self.conn.close()


class RecordsTable:

    def __init__(self):
        self.conn = psycopg2.connect(DATABASE_URL, sslmode='require')
        #self.conn = sqlite3.connect("spdb.db")
        self.cur = self.conn.cursor(cursor_factory=ext.DictCursor)
        self.cur.execute("""

                CREATE TABLE IF NOT EXISTS records
                    (
                        stdId      INTEGER NOT NULL,
                        attStat    INTEGER NOT NULL,
                        memoStat   INTEGER,
                        revStat    INTEGER,
                        recordDate TEXT NOT NULL
                    ) 
            
                        """)

    def display(self):
        self.cur.execute("""

                SELECT * 
                FROM records

                        """)
        self.records = self.cur.fetchall()
        return self.records

    def search(self, stdId):
        self.cur.execute(f"""

                SELECT * 
                FROM records 
                WHERE stdId = '{stdId}'

                        """)
        self.record = self.cur.fetchone()
        return self.record

    def insert(self, stdId, attStat, memoStat, revStat, recordDate):
        if (stdId == "" or attStat == "" or recordDate == ""):
            raise Exception("One of the entries is empty")
        self.cur.execute(f"""

                INSERT INTO records
                            (
                                stdId,
                                attStat,
                                amount,
                                exp
                            )
                VALUES
                            {( 
                                stdId, 
                                attStat, 
                                memoStat,
                                revStat,
                                recordDate
                            )};

                        """)
        self.conn.commit()

    def update(self, stdId, attStat, memoStat, revStat, recordDate):
        self.cur.execute(f"""

                UPDATE records 
                SET attStat = '{attStat}' 
                WHERE stdId = '{stdId}'
                        
                        """)
        self.cur.execute(f"""

                UPDATE records 
                SET memoStat = '{memoStat}' 
                WHERE stdId = '{stdId}'

                        """)

        self.cur.execute(f"""

                UPDATE records 
                SET revStat = '{revStat}' 
                WHERE stdId = '{stdId}'

                        """)

        self.cur.execute(f"""

                UPDATE records 
                SET recordDate = '{recordDate}' 
                WHERE stdId = '{stdId}'

                        """)
        self.conn.commit()

    def delete(self, stdId):
        if (stdId == None):
            raise Exception("You have to select an stdId to delete its values")
        self.cur.execute(f"""

                DELETE FROM records 
                WHERE id = '{stdId}'
        
                        """)
        self.conn.commit()

    def __del__(self):
        self.conn.close()
########################
###### Models END ######
########################