import React, { useState } from "react";
import { Form, notification } from "antd";
import { solAddressValidator } from "../util/validators";
import { getMints } from "../util/get-mints";

export const GibMints = ({ endpoint }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addressField, setAddressField] = useState<any>(undefined);
  const fetchMints = () => {
    notification.open({
      message: "Downloading your data.",
      key: "downloading",
      duration: 0,
    });
    setLoading(true);
    getMints(addressField.value, endpoint)
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        alert(e);
        setLoading(false);
      })
      .finally(() => {
        notification.close("downloading");
      });
  };

  return (
    <div className="card bg-gray-900">
      <Form
        form={form}
        name="mintIds"
        initialValues={{
          mintIds: "",
        }}
        onFieldsChange={(_, allFields) => {
          setAddressField(allFields[0]);
          allFields[0].errors;
        }}
        scrollToFirstError
        className={`w-full flex flex-col`}
      >
        <div className="card-body">
          <p>
            Gib-Mints serves one purpose: To gib you mints from Solana address.
          </p>
          <hr className="opacity-10 my-4" />

          <label style={{ marginBottom: "2rem" }}>
            Please gib SOL address to get all mints
          </label>
          <Form.Item name="mintIds" rules={[solAddressValidator]}>
            <input className="input" style={{ width: "100%" }} />
          </Form.Item>
          <div className="text-center">
            <button
              className={`btn btn-primary rounded ${loading ? "loading" : ""}`}
              disabled={addressField?.errors?.length || !addressField}
              onClick={() => fetchMints()}
            >
              {loading ? "Getting Mints.." : "Gib Mints!"}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};
