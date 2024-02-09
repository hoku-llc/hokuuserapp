import re
import json

def woah():
    print('woah')


# Read the contents of the hokuData.js file
with open('../HokuLocalUI/src/data/hokuData.js', 'r') as file:
    data = file.read()

#
# Extract the JSON part
start_index = data.index('{')
end_index = data.rindex('}') + 1
json_data = data[start_index:end_index]

# Replace single quotes with double quotes to make it valid JSON
json_data = json_data.replace("'", '"')

# Parse the JSON data
json_array_string = f'[{json_data.strip().strip(",")}]'
json_array_string = json_array_string.replace('\n', '').replace('    ', '')
print(json_array_string)
# Parse the JSON array string into a Python list of dictionaries
parsed_data = json.loads(json_array_string)

# Now you can use the parsed_data variable which contains your data
print(parsed_data)

units_of_ES = next((item['units'] for item in parsed_data if item['title'] == 'YM'), None)

# Print the units of the object with title 'ES'
print("Units of 'ES':", units_of_ES)

