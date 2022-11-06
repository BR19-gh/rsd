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
    return list
#######################
###### Other END ######
#######################