import React, { useState } from "react";
import { Form, notification } from "antd";
import { solAddressValidator } from "../util/validators";
import { getStuckSol } from "../util/get-stuck-sol";

export const GibStuckSol = ({ endpoint }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [addressField, setAddressField] = useState<any>(undefined);
  const fetchStuckSol = () => {
    notification.open({
      message: "Grabbing Candy Machine Data...",
      key: "downloading",
      duration: 0,
    });

    setLoading(true);
    getStuckSol(addressField.value, endpoint)
      .then(({ total, accounts }) => {
        alert(`${total} SOL are stuck in ${accounts} accounts`);
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
    <>
      <div className="prose max-w-full text-center mb-3">
        <h1 className="text-4xl">Find stuck SOL</h1>
        <hr className="opacity-10 my-4" />
      </div>
      <p className="px-2 text-center">
        This tool finds out how much SOL you have stuck in candy machine rents.{" "}
        <br />
        <a
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
          href="https://github.com/staccDOTsol/candy_config_refunds.MD"
        >
          {" "}
          Made possible by this script by stacc.sol
        </a>
      </p>
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
        >
          <div className="card-body">
            <label style={{ marginBottom: "2rem" }}>
              Please gib SOL address to get amount of SOL stuck in candy
              machines
            </label>
            <Form.Item name="mintIds" rules={[solAddressValidator]}>
              <input className={`textarea w-full shadow-lg`} />
            </Form.Item>
            <div className="text-center mt-4">
              <button
                className={`btn btn-primary rounded shadow-lg ${loading ? "loading" : ""}`}
                disabled={addressField?.errors?.length || !addressField}
                onClick={() => fetchStuckSol()}
              >
                {loading ? "Getting configs.." : "Gib Stuck SOL!"}
              </button>
            </div>
          </div>
        </Form>
      </div>

    </>
  );
};
