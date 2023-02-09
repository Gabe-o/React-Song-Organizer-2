import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from "draft-js";
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../styles/dmca.css";

//same as create acceptable use policy
function CreatePrivacyPolicy() {

  //sets state for editor state and converted content
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }

  //gets admin input from rich text editor and converts it to html
  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  }

  const createMarkup = () => {
    //posts new privacy policy to website
    fetch("/api/admin/update/privacyPolicy", { method: "POST", body: JSON.stringify({ "html": DOMPurify.sanitize(convertedContent) }), headers: new Headers({ 'Content-Type': 'application/json' }) })
      .then(res => res.json())
      .then(data => {
        alert("Policy has been updated");
      })
      .catch(err => {
        console.log(err);
      })
  }

  //returns rich text editor to make privacy policy
  return (
    <React.Fragment>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
      />
      <button className="submitButton" onClick={createMarkup}>Save Changes</button>
    </React.Fragment>
  )
}

export default CreatePrivacyPolicy;
