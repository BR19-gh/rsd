#####################
###### Imports ######
#####################
import sqlite3
from flask import Flask, render_template, jsonify, request, abort, redirect
import os
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras as ext
from flask_cors import CORS, cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from urllib.parse import unquote

from .models import *
from .other import *
#########################
###### Imports END ######
#########################


#####################
###### Configs ######
#####################
USERNAME = os.environ.get('USERNAME')
PASSWORD = os.environ.get('PASSWORD')
ADMIN_ROUTE = os.environ.get('ADMIN_ROUTE')

# print(USERNAME, PASSWORD)

app = Flask(__name__, template_folder='templates')
# cors = CORS(app)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1 per 30seconds", "50 per hour"]
)
#########################
###### Configs END ######
#########################


####################
###### Routes ######
####################
@app.route("/fillingStdInfo")
@limiter.exempt
def fillingStdInfo_view():


    return render_template('fillingStdInfoPage.html')


@app.route("/fillingStdRecords")
@limiter.exempt
def fillingStdRecords_view():


    return render_template('fillingStdRecordsPage.html')


@app.route("/reportPage")
@limiter.exempt
def reportPage_view():
    return render_template('reportPage.html')
########################
###### Routes END ######
########################


##########################
###### Backend Endpoints ######
##########################
@app.route("/student", methods=['POST'])
@app.route("/student/<idIn>", methods=['PUT', 'DELETE', 'GET'])
@limiter.limit('1 per 10seconds', per_method=True, methods=['PUT', 'POST', 'DELETE'])
def student(idIn=None):
    try:
        print('The ip address: ', get_remote_address())
        studentObj = StudentsTable()

        if request.method == 'POST':

            data = request.headers
            id = unquote(data['id'])
            name = unquote(data['name'])
            partsTotal = convertListToString(unquote(data['partsTotal']))

            try:
                result = studentObj.search(id)
                if result == None:
                    pass
                else:
                    return jsonify({"msg": f"Status Code 403: the student of id:{id} exists", "statCode": 403})
            except Exception as err:
                print(err, "line: 125")
                if (isinstance(id, int) == False):
                    return jsonify({"msg": f"Bad Request 400:  id is not integer, or it contains illegal form of characters", "statCode": 400})

            try:
                studentObj.insert(id, name, partsTotal)

                recordSearched = studentObj.search(id)
                if (recordSearched[0] == int(id)):
                    return jsonify({"msg": f"Success 201: student of id:{id} is recorded, the id matches {(studentObj.search(id))[0]}", "statCode": 201})
            except Exception as err:
                print(err, "line: 139")
                if (isinstance(id, int) == False):
                    return jsonify({"msg": f"Bad Request 400: student was not added, even the provided id, or it contains illegal form of characters", "statCode": 400})
                else:
                    return jsonify({"msg": f"Unkown Error 500: student of id:{id} was not recorded, the id doesn't match {(studentObj.search(id))[0]}", "statCode": 500})

        elif request.method == 'PUT':

            data = request.headers
            name = unquote(data['name'])
            partsTotal = convertListToString(unquote(data['partsTotal']))

            try:
                oldPrudRecord = studentObj.search(idIn)
                studentObj.update(idIn, name, partsTotal)

                recordSearched = studentObj.search(idIn)
                if recordSearched == None:
                    return jsonify({"msg": f"Error 404: student of idIn:{idIn} was not updated because they didn't have a record before (maybe first time adding?) ", "statCode": 404})
                else:
                    return jsonify({"msg": f"Success 200: student of idIn:{idIn} is updated, old data:{oldPrudRecord}, new data:{studentObj.search(idIn)}", "statCode": 200})
            except Exception as err:
                print(err, "line: 162")
                if (isinstance(idIn, int) == False):
                    return jsonify({"msg": f"Bad Request 400: student was not updated, even the provided id, or it contains illegal form of characters", "statCode": 400})
                else:
                    return jsonify({"msg": f"Unkown Error 500: student of idIn:{idIn} was not updated, old data:{oldPrudRecord}, new data:{studentObj.search(idIn)}", "statCode": 500})

        elif request.method == 'GET':

            try:
                result = studentObj.search(idIn)

                if result == None:
                    return jsonify({"msg": f"Success 202: the student of idIn {idIn} doesn't exist, so it can be added", "statCode": 202})
                else:
                    return jsonify({"msg": f"Status Code 403: the student of idIn {idIn} exists, {studentObj.search(idIn)[0::2]}", "statCode": 403})
            except Exception as err:
                print(err, "line: 178")
                if (isinstance(idIn, int) == False):
                    return jsonify({"msg": f"Bad Request 400:  student of idIn is not integer, or it contains illegal form of characters", "statCode": 400})

        elif request.method == 'DELETE':

            try:
                result = studentObj.search(idIn)

                if result == None:
                    return jsonify({"msg": f"Error 404: student of idIn:{idIn} was not found, it may not exist", "statCode": 404})
            except Exception as err:
                print(err, "line: 190")
                if (isinstance(idIn, int) == False):
                    return jsonify({"msg": f"Bad Request 400:  student of idIn is not integer, or it contains illegal form of characters", "statCode": 400})

            studentObj.delete(idIn)

            result = studentObj.search(idIn)

            if result == None:
                return jsonify({"msg": f"Success 204: student of idIn:{idIn} is deleted successfully, student of idIn:{idIn} doesn't exist anymore", "statCode": 204})
            else:
                return jsonify({"msg": f"Error 500: failed to delete student of idIn:{idIn}, student of idIn:{idIn} still exists", "statCode": 500})
    except Exception as err:
        print(err, "line: 203")


@app.route("/students", methods=['GET'])
@limiter.exempt
def students():
    studentObj = StudentsTable()

    result = studentObj.display()
    dictOfResult = {}

    j = 0
    for i in result:
        dictOfResult[i[0]] = {'id': i[0], 'name': i[1],
                              'partsTotal': i[2]}

    newIndex = sorted(dictOfResult, key=lambda d: d)
    dictOfResult = {k: dictOfResult[k] for k in newIndex}

    if(dictOfResult == {}):
        return jsonify({"msg": f"No Content 204: There is no content to get.", "statCode": 204})
    else:
        return jsonify(dictOfResult)
##############################
###### Backend Endpoints END ######
##############################


############################
###### Error Handlers ######
############################
@app.errorhandler(429)
def ratelimit_handler(e):

    return jsonify({"msg": f"Error 429: you have exceeded your rate-limit, any further requests will not be applied", "statCode": 429})


@app.errorhandler(401)
def ratelimit_handler(e):

    msg = '{"msg": f"Error 401: unauthrized access", "statCode": 401}'
    print(msg)
    return render_template('err/err401.html', msg=msg)


@app.errorhandler(500)
def ratelimit_handler(e):

    msg = '{"msg": f"Error 500: something in our side went wrong, surly we are working to fix it soon, please try again later", "statCode": 500}'
    print(msg)
    return render_template('err/err500.html', msg=msg)


@app.errorhandler(503)
def ratelimit_handler(e):

    msg = '{"msg": f"Error 503: server is down due to maintenance, please try again later", "statCode": 503}'
    print(msg)
    return render_template('err/err503.html', msg=msg)


@app.errorhandler(405)
def ratelimit_handler(e):

    msg = '"msg": f"Error 405: the method used is not allowed, please try again with correct method", "statCode": 405}'
    print(msg)
    return render_template('err/err405.html', msg=msg)


@app.errorhandler(404)
def ratelimit_handler(e):

    msg = '{"msg": f"Error 404: the requested URL was not found on the server. If you entered the URL manually please check your spelling and try again", "statCode": 404}'
    print(msg)
    return render_template('err/err404.html', msg=msg)
################################
###### Error Handlers END ######
################################


########################
##### Play Ground ######
########################

# def exexuteSql(sql):
#     conn = psycopg2.connect(DATABASE_URL, sslmode='require')
#     #conn = sqlite3.connect("spdb.db")
#     cur = conn.cursor(cursor_factory=ext.DictCursor)
#     cur.execute(sql)
#     conn.commit()

# @app.route("/playground/on/1", methods=['POST'])
# def playground1():
#     sql='ALTER TABLE promocodes ADD COLUMN exp TEXT;'
#     try:
#         exexuteSql(sql)
#         return jsonify(f"OK: ({sql}) was done successfully.")
#     except Exception as err:
#         return jsonify(f"ERR {err}: coudn't playground ({sql})")

# @app.route("/playground/on/2", methods=['POST'])
# def playground2():
#     sql2="ALTER TABLE billingHistory ALTER COLUMN id TYPE TEXT;"
#     sql="DROP TABLE billingHistory;"
#     try:
#         exexuteSql(sql)
#         return jsonify(f"OK: ({sql}) was done successfully.")
#     except Exception as err:
#         return jsonify(f"ERR {err}: coudn't playground ({sql})")

############################
##### Play Ground End ######
############################
