import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Header from "~/components/Header";
import { api, type RouterOutputs } from "~/utils/api";
import { useState } from "react";
import NoteEdittor from "~/components/NoteEdittor";
import NoteCard from "~/components/NoteCard";

export default function Home() {
  return (
    <>
      <Head>
        <title>Note Taker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <Content/>
    </>
  );
}

const Content: React.FC = () => {
  type Topic = RouterOutputs["topic"]["getAll"][0];

  const { data: sessionData } = useSession();

  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const {
    data: topics,
    refetch: refetchTopics
  } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedTopic(selectedTopic ?? data[0] ?? null);
      }
    }
  );

  const createTopic = api.topic.create.useMutation({
    onSuccess: () => {
      void refetchTopics();
    }
  });

  const {data: notes, refetch: refetchNotes} = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },{
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const createNotes = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    }
  });
  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    }
  });

  return(
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-56 bg-base-100 p-2">
          {
            topics?.map((topic) => (
              <li key={topic.id}>
                <Link href={'#'} onClick={(e) => {e.preventDefault(); setSelectedTopic(topic)}}>
                  {topic.title}
                </Link>
              </li>
            ))
          }
        </ul>
        <div className="divider"></div>
        <input type="text" name="" id="" placeholder="New Topic" className="input-bordered input input-sm w-full" onKeyDown={(e) => {
          if(e.key === "Enter") {
            createTopic.mutate({
              title: e.currentTarget.value,
            });
            e.currentTarget.value = "";
          }
        }}/>
      </div>
      <div className="col-span-3">
        <div className="">
          {notes?.map((note) => (
            <div className="mt-5" key={note.id}>
              <NoteCard note={note} onDelete={() => void deleteNote.mutate({id: note.id})}/>
            </div>
          ))}
        </div>
        <NoteEdittor onSave={({title, content}) => {
          void createNotes.mutate({
            title,
            content,
            topicId: selectedTopic?.id ?? ""
          })
        }}/>
      </div>
    </div>
  )
}