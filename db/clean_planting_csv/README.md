
# Background: Cleaning tree planting data

clean_planting_API_call.py is a Python script that cleans and reformats data downloaded directly from the Tree Planting form at the Open Data Kit (ODK) API created for Conservation360. The Tree Planting form contains information about trees planted in the field, such as the date they were planted, who planted them, their species, their height, their location, and an image URL.

The script also contains commented code to obtain information about other Conservation360 forms in the ODK API. Additional documentation about using the ODK API can be found at [https://odkcentral.docs.apiary.io/#](https://odkcentral.docs.apiary.io/#).

## What it does

clean_planting_API_call.py:
1) Creates an authentication token for the API
2) Retrieves the planting form submission data from the API and saves it as a csv 
3) Opens the csv as a Pandas dataframe for cleaning and reformatting
4) Creates an asset_id column and fills it with randomly generated uuids
5) Moves the asset_id column to the first column 
6) Splits the date/time of planting into separate date and time columns
7) Reformats the date into mm/dd/yyyy format to match other csvs used in the Conservation360 app 
8) Deletes extra columns not needed for the Conservation360 app
9) Renames the uuid column from ODK to clarify its origin and difference from asset_id
10) Completes the image URLs outputted in the photo column and renames the column to "image_url"
11) Cleans up the other column names to conform with naming conventions from other csvs used in the project
12) Verifies that required columns are present
13) Outputs a csv of the cleaned, processed data

## Required packages

The script requires uuid, requests, zipfile, io, and json, all standard Python packages, and Pandas. Pandas can be installed using the package manager [pip](https://pip.pypa.io/en/stable/). Additional installation methods for Pandas are available at [https://pandas.pydata.org/pandas-docs/stable/getting_started/install.html](https://pandas.pydata.org/pandas-docs/stable/getting_started/install.html).

```bash
foo@bar:~$ pip install pandas
```

## Usage

Lines 7 and 8 of the script must be updated with a valid email and password for the ODK API. New developers on the project should reach out to a Conservation360 administrator and ask them to create a new User account for them at ODK: [https://docs.getodk.org/central-users/#central-users-app-overview](https://docs.getodk.org/central-users/#central-users-app-overview)

To run the script, change directory via the command line into the location of your Conservation360/db/clean_planting_csv folder. This folder should contain the clean_planting_API_call.py script. From there the script is run via Python.

```console
foo@bar:~$ python clean_planting_API_call.py
```
If the script runs successfully, you will see the following output in your terminal:

```console
raw planting API data outputted to build_Tree-planting_1625058144.csv
started cleaning and formatting raw data
passed check: all required columns in cleaned data
cleaned planting data csv outputted as planting_processed.csv
```

The cleaned, reformatted csv will be created in the same Conservation360/db/clean_planting_csv folder.