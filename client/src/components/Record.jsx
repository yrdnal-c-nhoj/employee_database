import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const { token, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/record/${params.id.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
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
  }, [params.id, navigate, token, isAuthenticated]);

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
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(person),
        });
      } else {
        // if we are updating a record we will PATCH to /record/:id.
        response = await fetch(`${import.meta.env.VITE_API_URL}/record/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
      <h3 className="p-4 font-display font-semibold text-lg">Create/Update Employee Record</h3>
      <form
        onSubmit={onSubmit}
        className="p-4 border rounded-lg overflow-hidden"
      >
        <div className="gap-x-8 gap-y-10 grid grid-cols-1 md:grid-cols-2 pb-12 border-slate-900/10 border-b">
          <div>
            <h2 className="font-semibold text-label text-slate-900 text-base leading-7">
              Employee Info
            </h2>
            <p className="mt-1 text-label text-slate-600 text-sm leading-6">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="gap-x-6 gap-y-5 grid grid-cols-1 max-w-2xl">
            <div className="sm:col-span-4">
              <label
                htmlFor="firstName"
                className="block font-medium text-label text-slate-900 text-sm leading-9"
              >
                First Name
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 font-display text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
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
                className="block font-medium text-label text-slate-900 text-sm leading-3"
              >
                Last Name
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 font-display text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
                    placeholder="Last"
                    value={form.lastName}
                    onChange={(e) => updateForm({ lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="Favorite Color"
                className="block font-medium text-label text-slate-900 text-sm leading-6"
              >
                Favorite Color
              </label>
              <div className="mt-2">
                <div className="flex shadow-sm rounded-md ring-1 ring-slate-300 focus-within:ring-2 focus-within:ring-indigo-600 ring-inset focus-within:ring-inset sm:max-w-md">
                  <input
                    type="text"
                    name="position"
                    id="position"
                    className="block flex-1 bg-transparent py-1.5 pl-1 border-0 focus:ring-0 font-display text-slate-900 placeholder:text-slate-400 sm:text-sm sm:leading-6"
                    placeholder="Product Manager"
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
                      id="levelElf On Duty"
                      name="positionOptions"
                      type="radio"
                      value="Elf On Duty"
                      className="border border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "Elf On Duty"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="levelElf On Duty"
                      className="block mr-4 ml-3 font-display font-medium text-slate-900 text-sm leading-6"
                    >
                      Elf On Duty
                    </label>
                    <input
                      id="levelToymaker"
                      name="positionOptions"
                      type="radio"
                      value="Toymaker"
                      className="border border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "Toymaker"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="levelToymaker"
                      className="block mr-4 ml-3 font-display font-medium text-slate-900 text-sm leading-6"
                    >
                      Toymaker
                    </label>
                    <input
                      id="levelGiftWrap"
                      name="positionOptions"
                      type="radio"
                      value="GiftWrap"
                      className="border border-slate-300 focus:ring-slate-600 w-4 h-4 text-slate-600 cursor-pointer"
                      checked={form.level === "GiftWrap"}
                      onChange={(e) => updateForm({ level: e.target.value })}
                    />
                    <label
                      htmlFor="levelGiftWrap"
                      className="block mr-4 ml-3 font-display font-medium text-slate-900 text-sm leading-6"
                    >
                      GiftWrap
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 mt-4 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-label font-medium text-white text-sm transition-colors disabled:cursor-not-allowed"
        >
          CREATE/UPDATE EMPLOYEE RECORD
        </button>
      </form>
    </>
  );
}
