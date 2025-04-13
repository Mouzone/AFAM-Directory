import closeModal from "@/utility/closeModal";
import { SearchTerms } from "@/utility/types";
import { Dispatch, SetStateAction } from "react";

type SearchFormProps = {
    searchTerms: SearchTerms;
    setSearchTerms: Dispatch<SetStateAction<SearchTerms>>;
};
export default function SearchForm({
    searchTerms,
    setSearchTerms,
}: SearchFormProps) {
    return (
        <>
            <form method="dialog">
                <button
                    className="btn btn-md btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => closeModal()}
                >
                    ✕
                </button>
            </form>
            <form>
                <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                    <legend className="fieldset-legend">General</legend>

                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <label className="fieldset-label">First Name</label>
                            <input
                                type="text"
                                className="input"
                                value={searchTerms["First Name"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        "First Name": e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="fieldset-label">Last Name</label>
                            <input
                                type="text"
                                className="input"
                                value={searchTerms["Last Name"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        "Last Name": e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                            <label className="fieldset-label">
                                High School
                            </label>
                            <input
                                type="text"
                                className="input"
                                value={searchTerms["High School"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        "High School": e.target.value,
                                    })
                                }
                            />
                        </div>
                        {/* <div className="flex flex-col flex-1 min-w-[calc(50%-0.5rem)]">
                            <label className="fieldset-label">Grade</label>
                            <select
                                className="select"
                                value={searchTerms["Grade"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        Grade: e.target.value,
                                    })
                                }
                            >
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="fieldset-label">
                                Bible Study Teacher
                            </label>
                            <select
                                className="select"
                                value={searchTerms["Teacher"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        Teacher: e.target.value,
                                    })
                                }
                            >
                                <option>Anna Kwon</option>
                                <option>Chloe Han</option>
                                <option>Diane Song</option>
                                <option>Josephine Lee</option>
                                <option>Joshua Lee</option>
                                <option>JY Kim</option>
                                <option>Karen Park</option>
                                <option>Matt Yoon</option>
                                <option>Rachael Park</option>
                                <option>Shany Park</option>
                                <option>Sol Park</option>
                                <option>None</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <label className="fieldset-label">Gender</label>
                            <select
                                className="select"
                                value={searchTerms["Gender"]}
                                onChange={(e) =>
                                    setSearchTerms({
                                        ...searchTerms,
                                        Gender: e.target.value,
                                    })
                                }
                            >
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div> */}
                    </div>
                </fieldset>
                <div className="flex justify-end gap-4 mt-4">
                    <button className="btn btn-neutral" type="submit">
                        Submit
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => {
                            closeModal();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
}
