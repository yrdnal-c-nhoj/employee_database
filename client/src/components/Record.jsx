import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      const [firstName, ...rest] = record.name ? record.name.split(' ') : ['', ''];
      setForm({
        firstName: firstName,
        lastName: rest.join(' '),
        position: record.position,
        level: record.level,
      });
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const person = { name: form.firstName + ' ' + form.lastName, position: form.position, level: form.level };
    try {
      let response;
      if (isNew) {
        // if we are adding a new record we will POST to /record.
        response = await fetch(`${import.meta.env.VITE_API_URL}/record`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`${import.meta.env.VITE_API_URL}/record/${params.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('A problem occurred adding or updating a record: ', error);
    } finally {
      setForm({ firstName: "", lastName: "", position: "", level: "" });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="p-4 font-semibold text-lg">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="p-4 border rounded-lg overflow-hidden"
      >
        <div className="gap-x-8 gap-y-10 grid grid-cols-1 md:grid-cols-2 pb-12 border-slate-900/10 border-b">
          <div>
            <h2 className="font-semibold text-slate-900 text-base leading-7">
              Employee Info
            </h2>
            <p className="mt-1 text-slate-600 text-sm leading-6">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="gap-x-6 gap-y-8 grid grid-cols-1 max-w-2xl">
            <div className="sm:col-span-4">
              <label
                htmlFor="firstName"
                className="block font-medium text-slate-900 text-sm leading-6"
              >
                First Name
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
                    placeholder="First"
                    value={form.firstName}
                    onChange={(e) => updateForm({ firstName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="lastName"
                className="block font-medium text-slate-900 text-sm leading-6"
              >
                Last Name
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
                    placeholder="Last"
                    value={form.lastName}
                    onChange={(e) => updateForm({ lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="position"
                className="block font-medium text-slate-900 text-sm leading-6"
              >
                Position
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
                    placeholder="Developer Advocate"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="sm:flex sm:items-center sm:space-x-10 space-y-4 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="positionIntern"
                      name="positionOptions"
                      type="radio"
                      value="Intern"
                      className="border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "Intern"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionIntern"
                      className="block mr-4 ml-3 font-medium text-slate-900 text-sm leading-6"
                    >
                      Intern
                    </label>
                    <input
                      id="positionJunior"
                      name="positionOptions"
                      type="radio"
                      value="Junior"
                      className="border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "Junior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionJunior"
                      className="block mr-4 ml-3 font-medium text-slate-900 text-sm leading-6"
                    >
                      Junior
                    </label>
                    <input
                      id="positionSenior"
                      name="positionOptions"
                      type="radio"
                      value="Senior"
                      className="border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "Senior"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="positionSenior"
                      className="block mr-4 ml-3 font-medium text-slate-900 text-sm leading-6"
                    >
                      Senior
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex justify-center items-center bg-background hover:bg-slate-100 disabled:opacity-50 mt-4 px-3 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 h-9 font-medium text-md whitespace-nowrap transition-colors hover:text-accent-foreground cursor-pointer disabled:pointer-events-none"
        />
      </form>
    </>
  );
}
