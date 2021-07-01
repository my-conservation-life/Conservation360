
# Background: Cleaning tree planting data

clean_June_planting_csv.py is a Python script that cleans and reformats data downloaded in csv format from the Tree Planting form at the Open Data Kit API created for Conservation360. While the script is written for data collected in June 2020, it can be modified to clean any csv downloaded from this form.

## What it does

clean_June_planting_csv.py:
1) Reads in the csv 
2) Makes sure the required 'asset_id', 'latitude', and 'longitude' columns are present
3) Splits the date and time of planting into separate columns
4) Reformats the date into mm/dd/yyyy format to match other csvs used in the Conservation360 app 
5) Fills in spaces in the column names with an underscore, again to match other csvs used in the project
6) Checks if the asset_id column is blank, and if so, fills the column with a randomly generated ID
7) Outputs a csv of the cleaned, processed data

## Required packages

The script requires uuid, a standard Python package, and Pandas. Pandas can be installed using the package manager [pip](https://pip.pypa.io/en/stable/). Additional installation methods for Pandas are also available at [https://pandas.pydata.org/pandas-docs/stable/getting_started/install.html](https://pandas.pydata.org/pandas-docs/stable/getting_started/install.html).

```bash
foo@bar:~$ pip install pandas
```

## Usage

Change directory via the command line into the location of your Conservation360/db/clean_planting_csv folder. This folder should contain both the script and the csv to clean. From there the script is run via Python.

```console
foo@bar:~$ python clean_June_planting_csv.py
```
If the script runs successfully, you will see the following output in your terminal:

```console
passed check: all required columns in csv
processed csv outputted as June_planting_processed.csv 
```

The cleaned, reformatted csv will be created in the same Conservation360/db/clean_planting_csv folder.