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
          <p>
            Gib-Stuck-Sol serves one purpose: To gib you amount of SOL stuck in
            candy machines for a certain address. <br />
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

          <label style={{ marginBottom: "2rem" }}>
            Please gib SOL address to get amount of SOL stuck in candy machines
          </label>
          <Form.Item name="mintIds" rules={[solAddressValidator]}>
            <textarea rows={1} className={`textarea w-full`} />
          </Form.Item>

          <div className="text-center">
            <button
              className={`btn btn-primary rounded ${loading ? "loading" : ""}`}
              disabled={addressField?.errors?.length || !addressField}
              onClick={() => fetchStuckSol()}
            >
              {loading ? "Getting configs.." : "Gib Stuck SOL!"}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};
