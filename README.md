# Contact Extract

This is a simple program to extract contact information from emails.
It takes an email and an email signature and passes them into an LLM, and then produces a CSV that can be passed into any vCard-compatible contacts app.

Currently, add-in support for Outlook is WIP, because I don't have a Windows computer or Office Enterprise to test. Code should be working, but no guarantees.
Extensibility to further automate the extraction process on Outlook is also in progress.

Outlook Add-In functionality is *not* supported on MacOS unless you have an Office Enterprise account. If you do, you have to sideload the add-in. You can read how to do that on the [Microsoft Docs](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/sideload-outlook-add-ins-for-testing).

### How to Run
Make sure you have `npm` installed. 
You can get `npm` on the [Downloads Page](https://nodejs.org/en/download/).

After you have `npm` downloaded, clone this repo.
Then, through the terminal, just run `contactextract.ps1` for Windows devices, or `contactextract.sh` for Unix-like systems.

The program will prompt you for an API key. This is your OpenAI API key. Don't worry, it's only stored locally as an environment variable.

### Future Development

The run process will be simpler as soon as I'm able to deploy as an Outlook Add-In. Further, I'm planning on adding Google Contacts support, so you can directly add contacts to Google Contacts. Working on a persistent storage option, as well.
