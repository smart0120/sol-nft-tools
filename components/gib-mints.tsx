import React, { useContext, useState } from "react";
import { Form, notification } from "antd";
import { solAddressValidator } from "../util/validators";
import { getMints } from "../util/get-mints";
import { ModalContext } from "../providers/modal-provider";

export const GibMints = ({ endpoint }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { setModalState } = useContext(ModalContext);
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
        setModalState({
          message: e,
          open: true
        });
        setLoading(false);
      })
      .finally(() => {
        notification.close("downloading");
      });
  };

  return (
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Get Mint IDs</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">This tool gets all mint IDs associated with the given address.</p>
      <hr className="opacity-10 my-4" />
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
            <label style={{ marginBottom: "2rem" }}>
              Please gib SOL address to get all mints
            </label>
            <Form.Item name="mintIds" rules={[solAddressValidator]}>
              <input className="input shadow-lg" style={{ width: "100%" }} />
            </Form.Item>
            <div className="text-center">
              <button
                className={`btn btn-primary rounded shadow-lg ${
                  loading ? "loading" : ""
                }`}
                disabled={addressField?.errors?.length || !addressField}
                onClick={() => fetchMints()}
              >
                {loading ? "Getting Mints.." : "Gib Mints!"}
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};
