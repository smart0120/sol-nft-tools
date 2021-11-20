import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import { useCallback, useEffect, useState } from "react";
import { Divider, Button, Card, notification, Spin, Input, Form } from "antd";
import { FileUpload } from "./file-upload";
import { DownloadOutlined } from "@ant-design/icons";
import { download } from "../util/download";
import jsonFormat from "json-format";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  timeout: 1000000,
  protocol: "https",
});

const uploadToArweave = async (transaction) => {
  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
  }
};

const fileToBuffer = (
  file: File
): Promise<{ buffer: ArrayBuffer; file: File }> => {
  return new Promise((resolve) => {
    var reader = new FileReader();

    reader.onload = function (readerEvt) {
      var buffer = readerEvt.target.result;

      resolve({
        buffer: buffer as ArrayBuffer,
        file,
      });
    };

    reader.readAsArrayBuffer(file);
  });
};
export const generateArweaveWallet = async () => {
  const key = await arweave.wallets.generate();
  localStorage.setItem("arweave-key", JSON.stringify(key));
  return key;
};

export const getKeyForJwk = (jwk) => arweave.wallets.jwkToAddress(jwk);

export default function ARUpload() {
  const [jwk, setJwk] = useState<JWKInterface>();
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState("none");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jwkForm] = Form.useForm();

  const generate = () =>
    generateArweaveWallet().then(async (jwk) => {
      setJwk(jwk);
      const a = await getKeyForJwk(jwk);
      setAddress(a);
    });

  useEffect(() => {
    const previousKey = localStorage.getItem("arweave-key");
    if (previousKey) {
      if (!address) {
        try {
          const k = {
            "kty": "RSA",
            "e": "AQAB",
            "n": "v5qisA_jUmzanu_QCX6lTJ3uxNieybdSVV6e-gbmLqBNdSWGoSIu8wrr0NuaTBjfoZtLzi7PYJ4OWJYytirj9szLdBVoNQApNYClJmFcoJRscbkkhMeT6LYrNDKLH01hblMi2v_6C9SRz2oVmRbYJDSXJi2p47IKd6-k3RcPAhlWhcav92iE6uhR-ThA1OWaeWHhH3_RwiyXrnIktUVPGay5URrFtVqtzl3Gn8syh0qE8eosaVecYe2bgWJjJv-uYGEkh5jrjHc8X6pSQKZG6AXjxhHbwURu7RcBnx1N5IC7bykHE_TVpjDZFddXFjFgJanX87M_-kEAFzftKNApHeSlJO8eeiXBNRWtNjFpbulTVH6eG4l4OhhRgr1wVflhlGTnCDy42JB4iiLqFYnCvbSSx9vhno19y9pZd0oyhf-0pa8VRMQm5J9jXK5efE7uHrqowMjUrdVK58rf5zY8yqSabZh_xdiFDJrsPP9uW-dkA_uVaT9kI4M-JkCfe20NONvEfDyaSN0eaViH2cx_gTE85sAoHWOr-q5JRHTyzMXLuqXZwZdEGHDqLh3Prgm1Nxi_iFewekBriFh6gBl-u21a_0ilHJUuk_DBf-Je_ffFWt78YGWie3iBv9ri_oX7p9XH8CpcI5d3sjtHmc6CFSvA28SX21joTd2Sit3aJIE",
            "d": "DlkqZzRdYdoIeh_7zIY5IzZtf7y4EWOCzSVPkuoq2SGEg2oKvazVZrpx49taH-o57vx17gwH2BSl_uDKjeVC2oPGFZyXx-ZJ77mBRJFEcjsDLvX-I9pdO29O53MEg5TUH8KmiM9j_nhN7gIj-WmiSH3OtttzDjvSOFnFJxBXvaC_n7d8DHM9hujcYKUjh73k9kOL7AOypc-YkUX3dUKqNIJAg3AVj6npe5t-qQ86qrJ8J7CRYFcg_R1hyIvhYHWDrbCAn43mT8fLE9_plnFNPIlaYAYM1pmFFAilxLBZWawBPUcNgmNSj4Y3b4EHgsAyUse4BgYtm5Q8CUEVJ7oE5hiFuGPrW90WzzoLKRDkuenUJpfzYgljaca6g9bRWQgGEDU3cNzv8-ZV_EWZOskzlXf4WCa45xTwm2ih__958ryfQZDv_upjN9UdVKQcXieojdZlRKbJMtqS4-0pZrpl4fsCeH5p5un_2aSbwQA48sp6r9gGSO7evI0b5VWLBTwW1gpdfhzKPiLx9WMZ2swDi7My2C5NlwLrLv92RQv9zSoCyU8lkObIzzoGleAOqw4gxi5VtbJuhWOK0v4on5VrFzXjSvyLq_WK4hy-bsepSyQwJwaxqiTV2F0ingpJXcO_kyNDNHfW7C14oU3p7wxDb10mFw257VOaj9oiXMjF9JE",
            "p": "-Y00NiNbG3eCtCIE_NIaNvepp6fxC5uQvE3MUuvzB6_f6zDdzRxQEgQP-uPng8wPdxvXLDrfEjC4wkwVZ4n_scgS5SmuG79FZZi6dSqWT98qdFbQ9Mg8WLLJD5AQoKDXfIbSaTlmWqx3ZDQJuQSoYQiJMX_uIpA45ahotT3XzGxPQfIHlgoy2RnPir4Ky7X_ujEfdsgbGC728Lw9zG7QQzuM5xtqJy5pNFsNyjRu47zuAHdT43mbVeUXdIrPUgQKuYo3qWP7iykV1J3k8ecJoTQuwaPQwQobb_n1ADyo_KZM8eAlIC3ZZ_DyR0jgSgrWiUszwC1jY3ug1ImCHqmZSQ",
            "q": "xI4bEjfCIO4sqEglD9PWFSnRMyjrr-AR0f2bJNTa2JlfR5a72FL0HbMhspSW0jZWASy07j5Q59QAIinbMLWHLKhtK2iXHs5y23kx4bnWbKqywueJP4Yk2I6MWSa2w0WF6HQ8oiD-njz2Q5iSNjtuufXMXD_QGmgMeh4Eg7vxoW7ye-sT1eUMoTRTOZvBKStF4gCv7FeiL2owNt3dPaEzxdech0nSP7txaBkxOEIOX8L8SwdaMvlQwdp8XfN8WpTHG3ZI2Yz5ElLQtynTCPsnNeKS1-u-6kWOk4Sj9YFV1JYHgQ2Im8-WizzmSkkIMbKwq5clpZybYBbiVcSdSQQpeQ",
            "dp": "wbDybG7GwSvie9PH0T9172INAT8dnWfSUAWGaHoQeM_uWYrlLNUj5MfYa2BHConxGv615POQvnqofM428tUubBuhZtMR-yFbSL7hQh2a60WImyHjL4rXI_Uoj3a_IR2WA2ZVnCxcIFaqmFC3ly5hTmckrRHhkFwmfUJYewwUGeubHNExSCiETPN2nfZhRLnvUeHczQIF3aBeNH227Zy48uYeuCYUH3MrXuKpcl9-Di9O_3ee2flCMsoMiX1P6xWOCXKZP1WGIP3znsIquAMd-0wYWl2-ooYow6HboqJyex7MrBPQXQiZLM7cDa4nv_BnkcqX0TqpYMbNDwnnv8rdWQ",
            "dq": "U6oJa9_ACjRXXeoXnH0XCzsZiSVJ7Tr7Wt8QQsU3wirGm7pViucEcf_lwBXvfNsUELvu59oupf9fbytR2ZHrT98BWRDUApDt4u3bhbGMzAR8wum7SgbXeDZ1Fx2bfdMCBMg1Zu2Uc9aPHIa89cimgRFXQ40GD7dqWDCey1QcrhKDtKuDbfBpR9T19_eMaPG6dVDFkVxb9MLGcxRNMAaF-xij0BJkJCytQRo4ETJM3AYrTeR7SGdHMLzHY1ZZAFWDyvS2XaPcASivHsf2xEPjlNQ0nSQDx8SDw9cZ006SMkMKPqx8EZZzBiGOBODBVCYzfVaA99WJbYVQIiHmsUXMQQ",
            "qi": "IlM83B638uq-ZfTWP7FTIFqKSfSjYiyxyFAJ2ArV-MffB6r8uAOkOrCvOS0YYAI_hotisNjGOgu9V8K42CImM4Hc9eZu3uerJlmYvst3sE73Xs7dRYVc2SCipApivKW17GysLOV1W1Pax5dVFD7kGkiZsZ6UEQY-HPv0YqWmkvgJBOB3zkkUVO94QV8B3iJlKtTqpgsgysjHVEnDk87WaownUCRKpOsvKpnzsF3GOisfjG6lpNCE_pL_5l5K7eq5uWubuyauQApcFshD6tuCMTnF0wlUZQhNsHHRm7yCVNyqJcXWP_5b7T8VAQd7o2UUysrWWTKo5iqSxtRWyr_e5A"
          };
          localStorage.setItem('arweave-key', JSON.stringify(k))
          setJwk(k);
          getKeyForJwk(k).then((a) => {
            setAddress(a);
          });
        } catch (e) {
          console.log(e);
          generate();
        }
      }
    }
  }, [address, jwk]);

  const upload = useCallback(async () => {
    setLoading(true);
    const res = await Promise.all(
      files.map(async (f) => {
        const transaction = await arweave.createTransaction(
          { data: f.buffer },
          jwk
        );
        transaction.addTag("Content-Type", f.file.type);
        await arweave.transactions.sign(transaction, jwk);
        await uploadToArweave(transaction);
        return {
          link: `https://arweave.net/${transaction.id}`,
          name: f.file.name,
        };
      })
    );

    setLoading(false);
    download(`AR-upload-${Date.now()}.json`, jsonFormat(res));
  }, [files, jwk]);

  const downloadKey = useCallback(() => {
    if (!jwk || !address) {
      return;
    }
    download(`AR-${address}.json`, jsonFormat(jwk));
  }, [address, jwk]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (address) {
        const balance = await arweave.wallets.getBalance(address);
        setBalance(arweave.ar.winstonToAr(balance));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [address, balance]);

  const handleFiles = useCallback(async (_files: File[]) => {
    const loaded = await Promise.all(_files.map((f) => fileToBuffer(f)));
    setFiles(loaded);
  }, []);

  const importKey = useCallback(async () => {
    const { key } = jwkForm.getFieldsValue();
    try {
      const parsed = JSON.parse(key);
      const addr = await arweave.wallets.jwkToAddress(parsed);
      setJwk(parsed);
      setAddress(addr);
      localStorage.setItem("arweave-key", key);
      notification.open({
        message: "Successfully imported key!",
      });
    } catch (e) {
      notification.open({
        message: "Key could not be imported!",
      });
    }
  }, [jwkForm]);

  return (
    <>
      <p>
        Gib AR-Links lets you upload files to arweave. Please make sure to use
        files smaller than 250mb. Caution: Beta Version! It is possible that
        some files may fail to upload without error.
      </p>
      <p>
        Send some AR to this wallet to start uploading. You can download and
        empty the wallet later. You can get AR on{" "}
        <a href="https://binance.com" target="_blank" rel="noopener noreferrer">
          Binance
        </a>
      </p>
      <Divider />

      <div>
        {jwk && (
          <Card
            extra={
              <>
                <CopyToClipboard
                  text={address}
                  onCopy={() =>
                    notification.open({ message: "Copied to clipboard!" })
                  }
                >
                  <a style={{ marginRight: "1rem" }}>Copy Address</a>
                </CopyToClipboard>
                <a onClick={downloadKey}>Download Wallet</a>
              </>
            }
            title="Wallet"
          >
            <p>Address: {address}</p>
            <p>
              Balance:{" "}
              {balance === "none" ? (
                <Spin style={{ marginLeft: "1rem" }} />
              ) : (
                balance
              )}
            </p>
            <Divider />
            <FileUpload setFiles={handleFiles} />
          </Card>
        )}
        {!jwk && (
          <Card>
            <Form form={jwkForm}>
              <h3 style={{ textAlign: "center" }}>No Wallet found.</h3>
              <Divider />
              <Form.Item>
                <Button
                  size="large"
                  style={{ display: "block", margin: "0 auto", minWidth: 320 }}
                  onClick={() => generate()}
                >
                  Generate Wallet
                </Button>
              </Form.Item>
              <div style={{ textAlign: "center" }}>Or</div>
              <br />
              <Card>
                <h3 style={{ textAlign: "center" }}>
                  Import Wallet (JWK JSON)
                </h3>
                <br />
                <Form.Item name="key">
                  <Input.TextArea rows={10} />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      minWidth: 320,
                    }}
                    onClick={() => importKey()}
                  >
                    Import
                  </Button>
                </Form.Item>
              </Card>
            </Form>
          </Card>
        )}
      </div>

      {jwk && (
        <>
          <br />
          <Button
            type="primary"
            loading={loading}
            shape="round"
            disabled={!files.length}
            icon={<DownloadOutlined />}
            size="large"
            style={{ margin: "0 auto", display: "block" }}
            onClick={upload}
          >
            {loading ? "Uploading..." : "Gib AR Links!"}
          </Button>
          <br />
        </>
      )}
    </>
  );
}
