<a id="readme-top"></a>
<!-- ABOUT THE PROJECT -->
## Cypress Dashboard
Welcome to a beginner hands on training session on Cypress Dashboard by a beginner user :sweat_smile:, lets all learn together!

Here's why us, as QAs, should use Cypress Dashboard:
* View and debug past test results from your CI environment.
* Analyze and diagnose test health.
* Reduce test time and save money by smartly orchestrating future runs across multiple machines(This is the best part :satisfied:).
* View CI runs and test health directly from the Cypress app.
  
(I picked this directly from Cypress Docs :slightly_smiling_face:, you can see <a href="https://docs.cypress.io/guides/cloud/introduction#Flexible-enterprise-configuration-and-single-sign-on">here</a>)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Table of Contents
- [Cypress Dashboard](#cypress-dashboard)
- [Hands on Session](#hands-on-session)
- [Creating Personal Repository](#creating-personal-repository)
- [Setting up a small cypress project](#setting-up-a-small-cypress-project)
- [Github Workflow](#github-workflow)
- [New Project on Cypress Dashboard](#new-project-on-cypress-dashboard)
  - [Set Up Project Keys](#set-up-project-keys)
  - [Run from CLI](#run-from-cli)
  - [Github Secret Key](#github-secret-key)
- [Set up Runner](#set-up-runner)
  - [Set Permissions](#set-permissions)
- [Push Project](#push-project)
- [Run Test](#run-test)

<!-- GETTING STARTED -->
## Hands On Session

For the Round 2 training session, we will be setting up a repository and creating a smaill demo cypress test and try to integrate with cypress dashboard.
The following steps will be followed, and this repository will be used as a reference. Lets go!! :woman_dancing:

## Creating Personal Repository
For this you can use your personal git accounts or the existing selisegroup account, since we are only going to create one for ourselves. You can also keep this project to practice on in the future :hand_over_mouth:.
Here's how:

1. In you github account, click on the top left icon. There click on Home

![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/b7cfe205-9d8c-4f79-b569-209fee9c03b3)

3. At the center there, enter a Repository name, select either Public or Private and click Create
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/38d25679-3336-4a60-a6c3-0f2064c9aff6)

4. Then follow the steps given to clone the Repository,
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/c2304bfd-88b3-4b0e-9f60-49ebcbc16edc)
Create a new folder, then in terminal run the commands given one by one.

## Setting up a small cypress project
Then in the Repository that is cloned we will set up a small demo Cypress test. 
For this lets follow the <a href="https://docs.cypress.io/guides/getting-started/installing-cypress">Cypress Documentation</a>

Run cypress:
```
npx cypress open
```
Then create some test files, you can copy from this Repository.

## Github Workflow
The Github Workflow will be in the path `/.github/workflows/cypress.yml`, in your project. Here is the <a href="https://docs.github.com/en/actions/using-workflows/about-workflows">github workflow documentation</a> if you want to learn at a deeper level.

There is a place where you can look for extentions for the workflow, <a href="https://github.com/marketplace?page=2&type=actions">here</a>

The Workflow for Cypress Dashboard:
```
name: Cypress E2E Tests #you can give your own name here
on:  #triggers can be done in different ways this one is for default manual run
  workflow_dispatch: 

jobs: #this is the main workflow
  cypress-run:
    env:
      CYPRESS_host: # here give your host URL
      CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }} # we will set this up later, its devOps work but you will know where this is
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # this will be generated automatically no need to do anything but this line is important

    runs-on: self-hosted # this here specifies the runner, we will set up one for oueself to test on which will be self hosted

    strategy:
      # when one test fails, DO NOT cancel the other
      # containers, because this will kill Cypress processes
      # leaving Cypress Cloud hanging ...
      fail-fast: false
      #run copies of the current job in parallel
      matrix:
        containers: [1] #increase containers as necessary, but for now we will have only 1

    steps:
      - name: Set Date 
        id: date
        run: echo "currentDate=$(TZ=Asia/Thimphu date +%d-%b-%Y\ %H:%M:%S\ %Z)" >> $GITHUB_OUTPUT

      - name: Checkout # checkout to the branch with proper test or one with the main tests
        uses: actions/checkout@v3
        with: 
          ref: main # for now we will keep it to main branch

      - name: Setup Node version
        uses: actions/setup-node@v3
        with:
          node-version: '16.16.0' 

      - name: Cache node packages
        uses: actions/cache@v3
        id: cache-node-modules
        with:
          path: |
            **/node_modules
            ~/.cache/Cypress
          key: ${{ runner.os }}-cypress-cache-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-cypress-cache

      - name: Install Dependencies
        run: yarn install

      # different browsers can replace this section, for the code look below
      - name: Setup Chrome
        uses: browser-actions/setup-chrome@v1.2.0
        with:
          chrome-version: stable

      - run: chrome --version

      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          install: false
          record: true
          parallel: true # this has to be true for the parallel run to work
          project: ./
          spec: ./cypress/e2e/
          wait-on: https://parabank.parasoft.com/parabank/index.htm
          config-file: cypress.config.js
          # if your using a different browser then this part should change respectively
          browser: chrome

        env:
          COMMIT_INFO_MESSAGE: 'Test ${{ steps.date.outputs.currentDate }} '
          COMMIT_INFO_AUTHOR: 'PAA' # give your own name should be fine
```

For FireFox browser:
```
- name: Setup firefox
    id: setup-firefox
    uses: browser-actions/setup-firefox@v1
    with:
      firefox-version: ${{ matrix.firefox }}
- run: |
    echo Installed firefox versions: ${{ steps.setup-firefox.outputs.firefox-version }}
    ${{ steps.setup-firefox.outputs.firefox-path }} --version
```
Referred from <a href="https://github.com/browser-actions/setup-firefox">here</a>, this repo also had a branch with workflow configured for firefox, qa/different-browser

For Electron browser:
```
- name: Electron Builder Action
  uses: samuelmeuli/action-electron-builder@v1.6.0
```
Referred from <a href="https://github.com/marketplace/actions/electron-builder-action">here</a>

#### Other Documents to refer:

Workflow trigger <a href="https://docs.github.com/en/actions/using-workflows/triggering-a-workflow">docs</a>

Cypress Workflow <a href="https://github.com/cypress-io/github-action#action-version">docs</a>

Parallelization <a href="https://docs.cypress.io/guides/continuous-integration/github-actions#Parallelization">docs</a>

## New Project on Cypress Dashboard
Here too you can use your own personal account or the selisegroup account, we will be making a new organization to run our tests with github workflow.

1. In the Cypress Dashboard, on the top left corner click on the logo dropdown thing
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/e109d468-7110-429f-b35a-30adeb4c3c21)

2. Then click on `Create New Organization`
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/44d594c1-1054-4b08-aca8-5c0bdfbbeec0)

3. Enter a name for the organization, the second field is not necessary
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/0d9f1416-99fc-4b08-8afb-c2dafb8b7caf)

4. Select one of the options here
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/eb05c3f2-ef89-4d2f-b891-6c8cbdd1d67c)

5. You can skip this part :face_exhaling:
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/c6d56fe2-38a6-40c8-8601-6ffa82f26587)

### Set Up Project Keys
In the organization there can be many projects, by default a default project will be setup for you to use. Each project will have their own keys for connection.

1. Now we follow these steps to set up, this is for the default project, you can make more project
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/45a34fcc-defc-42a0-84b9-d5bb2fcafafc)

The Key in the setup step after we set it up in the config file
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/1c15ae86-42cc-4a80-9f83-17dc50a54948)

2. The most important part its here:
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/a147b1b7-3fd7-4779-896f-55b7bdc865e3)

### Run from CLI

We have to get the key and have the main branch set up
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/6eddfe4f-d7ac-4dc0-bfbe-76f945781155)

We will run a command to run the test from our machine to the dashboard directly, take the key and replace it in the command below:
```
npx cypress run --spec cypress/e2e/ --config-file cypress.config.ts --record --key KEY_HERE
```

The results will look like this:
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/77621806-c9bc-4936-af84-2acc4829cab0)

Then this will also show up:
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/f705db04-463e-40b1-aefc-be4e415306c9)

### Github Secret Key
Now we have to setup the Secret Key, that very long key in the settings this is also necessary for the connection. The short key goes in the Cypress config file but the long key will go into the github repository we made before.

This will be done by the DevOps(In the company we dont have permissions for this), but for our hands on practice we will do it ourselves :triumph:.

1. In the repository created before, go to the Settings
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/8d4f0334-5ac0-4b93-809b-3d0d66f85bfe)

2. Then in the Security section, click on Secrets and Variables
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/c796208c-0701-4cae-9dbe-c45768b459e6)

3. Click on Actions
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/03761842-cfb2-4b2d-aaad-3e988810a6c8)

4. Click on New Repository Secret
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/053dc381-ab34-45b8-ae85-7edd511fecd8)

5. Here add the secret name and the long key in that big input field, :warning: remember the format for the secret name is all CAPITAL and _ instead of space, CYPRESS_RECORD_KEY, you can give any name but it has to match in the workflowfile.
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/b972e967-9bd6-4b7b-b83f-6991d3d09063)

6. Save and your done :thumbsup:
   
## Set up Runner
This part is also done by DevOps, they set up the runners for the projects but since this is a prcatice we will do it ourselves (fighting :fist_raised:).

Dont worry this sis nothing difficult :smirk:.

1. Again we will be going to the Settings in the repository
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/8d4f0334-5ac0-4b93-809b-3d0d66f85bfe)

2. This time we go to Actions
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/eb7afb92-8768-46da-8940-a27610cbbcaa)

3. And select Runners
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/39f5c39b-484d-4426-a139-74a89859eab2)

4. Click on New Self-hosted Runners
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/4039b7ea-51ba-4e5f-beea-a479cc8c5093)

5. Select Linux and x64, this is the image for the runner so its ok to select any
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/eaeb8058-1b68-4cf7-b0a7-5bb2187f7c30)

6. Next is to just follow the given steps :wink:.
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/35000b26-2e57-40e4-a09b-2e124309fe3a)

The last command will give this kind of output:
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/5b93ddcc-4991-44cf-b93e-b347be24ef61)


### Set Permissions
For the test to run we have to setup a small permission,

1. Under Actions, click on General
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/3b0aefbc-74b6-4735-819e-1d7d8053faaf)

2. Scroll down a bit, you will find permission for Workflow, set it to Read and Write
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/97c42246-9b34-47a0-b227-e38b34d38407)

## Push Project
With the keys all set up we will push the project to the repository.

```
git add .
git commit -m 'dashboard setup completed'
git push
```
##  Run Test
In the repository, the workflow will have been setup.

1. Go to Actions
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/c020b417-a17c-4934-be58-4d3ca6e71cfc)

2. Along the menus you will see Cypress test section, then name will be what you set in the work flow
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/c6bbbf3e-68f5-4b5d-b8bf-85f42a2ee513)

3. Since we setup a manual runner first click on the Cypress Test section, there will be an option for manual run
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/915a1aa8-8316-4114-8081-3f3ee4417399)

4. Click there and you can enter any branch you want but for now we only have one and click run
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/25f0f259-9133-438c-b3b1-9c11ba1b6b66)

The Workflow run will be sent to the cypress dashboard.
![image](https://github.com/SangayLakshay/cypressDashboard/assets/138775159/2d1cf699-5e90-4765-a2f3-39981fa0df54)

Yay! :partying_face: with this we have successfully connected github actions with cypress dashboard. If it didnt work for you, then do these steps again :upside_down_face:.
[back to top](#readme-top)
