import { Form, notification } from "antd";
import React, { useState } from "react";
import { jsonValidator } from "../util/validators";
import { getHolders } from "../util/get-holders";
import { download } from "../util/download";
import jsonFormat from "json-format";
export const GibHolders = ({ endpoint }) => {
  const [form] = Form.useForm();
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jsonVal, setJsonVal] = useState(undefined);

  const fetchHolders = () => {
    notification.open({
      message: "Downloading your data.",
      key: "downloading",
      duration: 0,
    });

    setLoading(true);
    getHolders(jsonVal, setCounter, endpoint).subscribe({
      next: (e) => {
        download("gib-holders.json", jsonFormat(e, { size: 1, type: "tab" }));
        setLoading(false);
      },
      error: (e) => {
        alert(e);
        setLoading(false);
      },
      complete: () => {
        notification.close("downloading");
      },
    });
  };

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Holder Snapshot</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tools gives you a snapshot of holders from Solana Mint IDs. It will
        return an object with holders, mints and amounts.
      </p>
      <hr className="my-4 opacity-10" />
      <div className="card bg-gray-900 max-w-full">
        <Form
          form={form}
          name="holders"
          initialValues={{
            holders: [],
          }}
          scrollToFirstError
          className={`w-full flex flex-col`}
        >
          <div className="card-body">
            <label style={{ marginBottom: "2rem" }}>
              Please gib SOL mint IDs as JSON array to get their holders.
            </label>
            <Form.Item name="holders" rules={[jsonValidator(setJsonVal)]}>
              <textarea rows={4} className={`textarea w-full shadow-lg`} />
            </Form.Item>
            <div className="text-center">
              <button
                disabled={!jsonVal || !jsonVal.length}
                className={`btn btn-primary rounded shadow-lg ${
                  loading ? "loading" : ""
                }`}
                onClick={() => fetchHolders()}
              >
                {loading ? `${counter} / ${jsonVal?.length}` : "Gib Holders!"}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};
