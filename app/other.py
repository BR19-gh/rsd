#####################
###### Imports ######
#####################

#########################
###### Imports END ######
#########################

###################
###### Other ######
###################
def convertListToString(list):
    print("list: ",list)
    listStr = ""
    for elm in list:

        if(elm==list[len(list)-1]):
            listStr+=f"{elm}"

        else:
            listStr+=f"{elm} "
    print("listStr: ",listStr)
    raise Exception(f"list: {list}\n listStr:{listStr}")
    return listStr
#######################
###### Other END ######
#######################