import OpenAI from "openai";
import { saveAs } from 'file-saver';
import { expectedHeaders } from "./consts";

console.log("Full process.env:", process.env);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generate_csv = async (email, entry) => {
    const resp =  await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {
        "role": "system",
        "content": [
            {
            "type": "text",
            "text": "You are an assistant that is supposed to produce Google Contact CSVs from email signatures. For each input, strip commas from the signature. Then, carefully extract data into the following CSV format. Leave values empty if they cannot be found. However, infer values when reasonable. Do NOT include the CSV headers. Only provide the values. Carefully double-check the output to ensure no values are misplaced. For all values stored as 'Label, Value', use 'Work' as the label, and store the associated value. \n\nName Prefix, First Name, Middle Name, Last Name, Name Suffix, Phonetic First Name, Phonetic Middle Name, Phonetic Last Name, Nickname, File As, Email 1 - Label, Email 1 - Value, Phone 1 - Label, Phone 1 - Value, Address 1 - Label, Address 1 - Country, Address 1 - Street, Address 1 - Extended Address, Address 1 - City, Address 1 - Region, Address 1 - Postal Code, Address 1 - PO Box, Organization Name, Organization Title, Organization Department, Birthday, Event 1 - Label, Event 1 - Value, Relation 1 - Label, Relation 1 - Value, Website 1 - Label, Website 1 - Value, Custom Field 1 - Label, Custom Field 1 - Value, Notes, Labels"
            }
        ]
        },
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": (entry + " " + email)
            }
        ]
        },
    ],
    response_format: {
        "type": "text"
    },
    temperature: 0,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
    });
    const content = resp["choices"][0]["message"]["content"]
    console.log(content);
    return content;
}

export const submit_to_gc = async (contactData) => {
    console.log("contactData: ", contactData);
    var output = "";
    for (let i of expectedHeaders) {
        let data = contactData[i] !== undefined ? contactData[i] : "";
        output += data + ",";
    }
    console.log(output);
    const fileName = new Date().toISOString().split('T')[0] + contactData["First Name"] + contactData["Last Name"] + ".csv";
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, fileName);
    
    return output;
}