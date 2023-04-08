import { nanoid } from "nanoid";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { MdDarkMode, MdDelete, MdLightMode } from "react-icons/md";

const ThemeContext = createContext(null);

const SearchNotes = ({ handleSearch }) => {
  return (
    <input
      type="text"
      className="bg-white dark:bg-slate-800 dark:text-white shadow w-96 px-4 py-2 rounded-full text-sm focus:outline-1 focus:outline-indigo-600"
      placeholder="Search notes..."
      onChange={handleSearch}
    />
  )
}

const Note = ({ note, handleDeleteNote, ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 dark:text-white shadow w-full h-52 rounded flex flex-col ${props.className}`}>
      <div className="flex-grow whitespace-pre-wrap text-sm p-4">
        {note.text}
      </div>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-xs text-gray-600 dark:text-gray-400 rounded-b">
          {note.date}
        </div>
        <div className="">
          <button className="text-gray-400 hover:text-gray-800 dark:hover:text-white" onClick={() => handleDeleteNote(note.id)}><MdDelete /></button>
        </div>
      </div>
    </div>
  )
}

const NewNote = ({ handleAddNote, ...props }) => {
  const [note, setNote] = useState("");

  return (
    <div className={`bg-white dark:bg-slate-800 dark:text-white shadow w-full h-52 rounded flex flex-col ring-2 ring-transparent focus-within:ring-indigo-600 ${props.className}`}>
      <textarea
        className="dark:bg-slate-800 p-4 w-full h-full resize-none outline-none text-sm overflow-auto rounded-t"
        value={note}
        placeholder="Type here something..."
        onChange={(e) => setNote(e.target.value)}
      // onKeyDown={(e) => {
      //   if (e.key == "Enter") {
      //     handleAddNote(note);
      //     setNote("");
      //   }
      // }}
      ></textarea>
      <div className="flex justify-between items-center px-4 py-2">
        <div className="text-xs text-gray-600 dark:text-gray-400 rounded-b">
          {new Date().toDateString()}
        </div>
        <div className="">
          <button
            className="bg-gray-200 dark:bg-indigo-600 dark:text-white text-xs px-4 py-2 rounded-full text-gray-800 hover:bg-indigo-600 hover:text-white transition-colors"
            onClick={() => {
              handleAddNote(note);
              setNote("");
            }}
          >Save</button>
        </div>
      </div>
    </div>
  )
}

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <button
      className="absolute bg-white dark:bg-slate-800 dark:text-white flex justify-center items-center shadow w-8 h-8 rounded-full top-4 right-4"
      onClick={() => setTheme(prevState => (prevState === "light") ? "dark" : "light")}
    >
      {theme === "light" ? <MdDarkMode /> : <MdLightMode />}
    </button>
  )
}


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const firstRender = useRef(true);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes"));
    if (savedNotes) setNotes(savedNotes);
  }, []);

  useEffect(() => {
    if (firstRender.current) firstRender.current = false;
    else localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes, firstRender]);

  const handleAddNote = (note) => {
    setNotes(prevState => ([
      ...prevState,
      {
        id: nanoid(),
        text: note,
        date: new Date().toDateString()
      }
    ]))
  }

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(item => item.id !== id);
    setNotes(updatedNotes);
  }

  const handleSearch = (e) => setSearchText(e.target.value.toLocaleLowerCase());

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <main className="relative bg-slate-200 w-full min-h-screen pb-10 dark:bg-slate-900">
        <ThemeSwitcher />
        <div className="max-w-6xl m-auto">
          <div className="flex justify-center p-4 mb-6">
            <SearchNotes handleSearch={handleSearch} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {notes.filter((note) => note.text.toLowerCase().includes(searchText)).map((note, index) => (
              <Note key={index} className="col-span-1" note={note} handleDeleteNote={handleDeleteNote} />
            ))}
            <NewNote handleAddNote={handleAddNote} />
          </div>
        </div>
      </main>
    </ThemeContext.Provider>
  )
}
