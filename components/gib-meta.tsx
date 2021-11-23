import React, { useState } from "react";
import { Divider, Form, notification } from "antd";
import { jsonValidator } from "../util/validators";
import { getMeta } from "../util/get-meta";
import { download } from "../util/download";
import jsonFormat from "json-format";

export const GibMeta = ({ endpoint }) => {
  const [form] = Form.useForm();
  const [jsonVal, setJsonVal] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  const fetchMeta = () => {
    notification.open({
      message: "Downloading your data.",
      key: "downloading",
      duration: 0,
    });

    setLoading(true);
    getMeta(jsonVal, setCounter, endpoint).subscribe({
      next: (e) => {
        download("gib-meta.json", jsonFormat(e, { size: 1, type: "tab" }));
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
    <div>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Token Metadata</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className='px-2 text-center'>
        This tool gives you onchain an arweave/ipfs metadata from Solana Mint IDs.
      </p>
      <hr className="opacity-10 my-4" />
      <div className="card bg-gray-900 max-w-full">
        <Form
          form={form}
          name="mintIds"
          initialValues={{
            mintIds: [],
          }}
          scrollToFirstError
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="card-body">
            <label style={{ marginBottom: "2rem" }}>
              Please gib SOL mint IDs as JSON array to get their metadata
            </label>
            <Form.Item name="mintIds" rules={[jsonValidator(setJsonVal)]}>
              <textarea rows={4} className={`textarea w-full`} />
            </Form.Item>

            <div className="text-center">
              <button
                className={`btn btn-primary rounded ${
                  loading ? "loading" : ""
                }`}
                disabled={!jsonVal || !jsonVal.length}
                onClick={() => fetchMeta()}
              >
                {loading ? `${counter} / ${jsonVal?.length}` : "Gib Meta!"}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
