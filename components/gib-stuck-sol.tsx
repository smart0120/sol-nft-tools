import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { Divider, Form, Button, Input, notification } from "antd";
import { solAddressValidator } from "../util/validators";
import { getStuckSol } from "../util/get-stuck-sol";

const { TextArea } = Input;
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
      .then(({total, accounts}) => {
        alert(`${total} SOL are stuck in ${accounts} accounts`)
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
      <p>
        Gib-Stuck-Sol serves one purpose: To gib you amount of SOL stuck in
        candy machines for a certain address.
      </p>
      <Divider />

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
        className={`${styles["full-width"]} ${styles["d-flex"]} ${styles["flex-col"]}`}
      >
        <label style={{ marginBottom: "2rem" }}>
          Please gib SOL address to get amount of SOL stuck in candy machines
        </label>
        <Form.Item name="mintIds" rules={[solAddressValidator]}>
          <TextArea
            rows={1}
            className={styles.card}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Button
          type="primary"
          loading={loading}
          shape="round"
          disabled={addressField?.errors?.length || !addressField}
          icon={<DownloadOutlined />}
          size="large"
          style={{ margin: "0 auto", display: "block" }}
          onClick={() => fetchStuckSol()}
        >
          {loading ? "Getting configs.." : "Gib Stuck SOL!"}
        </Button>
      </Form>
    </>
  );
};
