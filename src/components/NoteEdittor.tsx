import {useState} from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

const NoteEdittor = ({
  onSave
}: {
  onSave: (note: {title: string; content: string}) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  return(
    <div className="card mt-5 border border-gray-200 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <input type="text" placeholder="Note Title" className="input-primary input input-lg w-full font-bold" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
        </h2>
        <ReactCodeMirror value={code} width="500px" height="30vh" minWidth="100%" minHeight="30vh" extensions={[
          markdown({base: markdownLanguage, codeLanguages: languages})
        ]} onChange={(value) => setCode(value)} className="border border-gray-300"/>
      </div>
      <div className="card-actions justify-end">
        <button onClick={() => {onSave({title, content: code}); setCode(""); setTitle("")}} className="btn-primary btn" disabled={title.trim().length === 0 || code.trim().length === 0}>Save</button>
      </div>
    </div>
  );
}

export default NoteEdittor