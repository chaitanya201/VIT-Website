import React, { useEffect } from "react";

export default function ProjectRemarkCell({
  row,
  remark,
  setRemark,
  addRemark,
  setProjectId,
}) {
  useEffect(() => {
    setProjectId(row._id);
    setRemark(row.comments);
  }, []);
  console.log("remark is ", remark);
  return (
    <div>
      {remark ? (
        <div>
          <form onSubmit={addRemark} className="flex">
            <div>
              <textarea
                cols="30"
                rows="10"
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                }}
              ></textarea>
            </div>
            <div>
              <button className="bg-cyan-500">
                <input type="submit" value={"Add"} />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>NA</div>
      )}
    </div>
  );
}
