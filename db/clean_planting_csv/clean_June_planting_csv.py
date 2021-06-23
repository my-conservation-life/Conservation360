import pandas as pd

data_raw = pd.read_csv('June_planting.csv')

#check if required columns are there
if set(['asset_id','latitude','longitude']).issubset(data_raw.columns):
    print('passed check: all required columns in csv')

else: 
    raise Exception('csv needs asset_id, latitude, and longitude columns in order to process')

#split date/time
data_raw[['date of planting','time of planting']] = data_raw['date/time of planting'].str.split(' ', 1, expand=True)

#reformat date to mm/dd/yyyy
data_raw['date of planting'] = pd.to_datetime(data_raw['date of planting']).dt.strftime('%m/%d/%Y')

#delete orig date/time column
data_raw = data_raw.drop(columns=['date/time of planting'])

#insert underscore for any spaces in column names
data_raw.columns = data_raw.columns.str.replace(' ', '_')

#output processed csv
data_raw.to_csv('June_planting_processed.csv', index=False)
print('processed csv outputted as June_planting_processed.csv')