from json import dumps
import re
import ast

columns = {
    "classroom":  ['building', 'room_number', 'capacity'],
    "department": ['dept_name', 'building', 'budget'],
    "course":     ['course_id', 'title', 'dept_name', 'credits'],
    "instructor": ['ID', 'name', 'dept_name', 'salary'],
    "section":    ['course_id', 'sec_id', 'semester', 'year', 'building', 'room_number', 'time_slot_id'],
    "teaches":    ['ID', 'course_id', 'sec_id', 'semester', 'year'],
    "student":    ['ID', 'name', 'dept_name', 'tot_cred'],
    "takes":      ['ID', 'course_id', 'sec_id', 'semester', 'year', 'grade'],
    "advisor":    ['s_ID', 'i_ID'],
    "time_slot":  ['time_slot_id', 'day', 'start_hr', 'start_min', 'end_hr', 'end_min'],
    "prereq":     ['course_id', 'prereq_id']
}
listparser = ['room_number', 'capacity', 'budget', 'credits', 'salary', 'year', 'tot_cred', 'start_hr', 'start_min', 'end_min']

def IsOnlyNumbersOrDecimal(string):
    return bool(re.compile(r'^[0-9]+(\.[0-9]+)?$').match(string))

def ParserToNoSQL(TableName, ListValues):
    GetColumns = columns[TableName]
    i = 0
    RawData = {}
    for column in GetColumns:
        CollectValues = ListValues[i]
        if (CollectValues != None and IsOnlyNumbersOrDecimal(CollectValues)):
            try:
                RawData[column] = int(CollectValues)
            except ValueError:
                try:
                    RawData[column] = float(CollectValues)
                except ValueError:
                    None #lmao
        else:
            RawData[column] = ListValues[i]
        i = i + 1
    CollectJson = dumps(RawData)
    writeOutput(TableName, CollectJson)
    

def writeOutput(TableName, JsonString):
    with open('output.txt', 'a') as output:
        output.write(f"db.getCollection('{TableName}').insertOne(\n")
        output.write("\t" + JsonString + '\n')
        output.write(");\n")

def readFile(columnHeader):
    with open("smallRelationsInsertFile.sql", "r") as file:
        for line in file:
            regexForValues = re.compile(r"\(.+\)")
            match = regexForValues.search(line)
            if match:
                matched_string = match.group(0)
                stringFixNull = matched_string.replace('null', 'None')   
                                
                first_char_regex = match.start()
                raw_query_string = line[:first_char_regex]
                
                regexForTablename = re.compile(r"(\w+)", re.IGNORECASE)
                GetTablename = regexForTablename.findall(raw_query_string)             
                
                ListaParseada = ast.literal_eval(stringFixNull)
                list_data = list(ListaParseada)                
                print(GetTablename[2], " - ", list_data)
        
                ParserToNoSQL(GetTablename[2], list_data)            
readFile(columns)
