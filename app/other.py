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
    listStr = ""
    for elm in list:

        if(elm==list[len(list)-1]):
            listStr+=f"{elm}"

        else:
            listStr+=f"{elm} "
        
    return listStr
#######################
###### Other END ######
#######################