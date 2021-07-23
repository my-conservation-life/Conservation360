import requests, zipfile, io, json, uuid
import pandas as pd 

if __name__ == "__main__":
    #set url and email credential variables
    def set_url_email_creds():
        global central_url
        central_url = "https://senecaparkzoo.getodk.cloud"
        global central_email
        global central_password
        central_email = input("Please enter your email for the ODK API: ")
        central_password = input("Please enter your password for the ODK API: ")

    #gets authentication token
    def get_email_token():
        email_token_response = requests.post(
            central_url + "/v1/sessions",
            data=json.dumps({"email": central_email, "password": central_password}),
            headers={"Content-Type": "application/json"},
        )
        if email_token_response.status_code == 200:
            return email_token_response.json()["token"]
        else: 
            raise Exception("Invalid authentication response")

    #gets json list of forms and form IDs - may be useful for future data imports
    #xmlFormId contains the form ID to put into form_response path for retrieving form submissions
    def get_forms(email_token):
        get_forms_response = requests.get(
            central_url + "/v1/projects/1/forms/",
            headers={"Authorization": "Bearer " + email_token},
        )
        print(get_forms_response.json())

    #retrieves planting form submission data from API
    def get_planting_form(email_token):
        form_response = requests.get(
            central_url + "/v1/projects/1/forms/build_Tree-planting_1625058144/submissions.csv.zip",
            headers={"Authorization": "Bearer " + email_token},
            stream=True
        )
        z = zipfile.ZipFile(io.BytesIO(form_response.content))
        z.extractall()

    #logs in to API, calls get_planting_form
    def get_planting_csv():
        set_url_email_creds()
        email_token = get_email_token()
        if email_token:
            get_planting_form(email_token)
            print("raw planting API data outputted to build_Tree-planting_1625058144.csv")
        else: 
            raise Exception("Error getting API token")

    #processes and cleans planting data from API
    def clean_planting_csv():
        #read in data as pandas dataframe for cleaning
        data_raw = pd.read_csv("build_Tree-planting_1625058144.csv")
        print("started cleaning and formatting raw data")

        #create asset_id column and fill with shortened uuid to fit in sql bigint field
        data_raw["asset_id"] = ""
        DIGITS = 16
        data_raw["asset_id"] = [int(uuid.uuid4().hex[:DIGITS], base=16) for _ in range(len(data_raw.index))]

        #make asset_id the first column
        first_column = data_raw.pop("asset_id")
        data_raw.insert(0, "asset_id", first_column)

        #split date/time column
        data_raw[["date_of_planting","time_of_planting"]] = data_raw["Time"].str.split("T", 1, expand=True)

        #reformat date to mm/dd/yyyy
        data_raw["date_of_planting"] = pd.to_datetime(data_raw["date_of_planting"]).dt.strftime("%m/%d/%Y")

        #delete unwanted columns
        data_raw = data_raw.drop(columns=["Time","Location-Accuracy", "Choose_planter","SubmissionDate", "Date", "DeviceID", "KEY"])
        data_raw = data_raw.drop(columns=["SubmitterID", "AttachmentsPresent", "AttachmentsExpected", "ReviewState", "Edits", "DeviceID.1"])

        #rename meta-instanceID column to clarify difference from uuid in asset_id
        data_raw = data_raw.rename(columns={"meta-instanceID": "ODK_meta-instanceID"})

        #complete URL in photo column, rename column to "image_url"
        #<your-server>/v1/projects/<projectId>/forms/<xmlFormId>/submissions/<instanceId>/attachments/
        data_raw["Photo_planted_sapling"] = "https://senecaparkzoo.getodk.cloud/v1/projects/1/forms/build_Tree-planting_1625058144/submissions/" + data_raw["ODK_meta-instanceID"].astype(str) + "/attachments/" + data_raw["Photo_planted_sapling"].astype(str)
        data_raw = data_raw.rename(columns={"Photo_planted_sapling":"image_url"})

        #clean up other column names
        data_raw = data_raw.rename(columns={"Location-Latitude":"latitude", "Location-Longitude":"longitude", "QR_Code":"tree_ID"})
        data_raw = data_raw.rename(columns={"Tree_Species":"species", "SubmitterName":"submitter_name"})

        #column names to lower case
        data_raw.columns= data_raw.columns.str.lower()

        #insert underscore for any spaces in column names
        data_raw.columns = data_raw.columns.str.replace(" ", "_")

        #double check that required columns are there
        if set(["asset_id","latitude","longitude"]).issubset(data_raw.columns):
            print("passed check: all required columns in cleaned data")

        else: 
            raise Exception("csv needs asset_id, latitude, and longitude columns in order to process")

        #output processed csv
        data_raw.to_csv("planting_processed.csv", index=False)
        print("cleaned planting data csv outputted as planting_processed.csv")

    get_planting_csv()
    clean_planting_csv()