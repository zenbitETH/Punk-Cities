import { NFTStorage, File } from "nft.storage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import mime from "mime";
import { v4 as uuidv4 } from "uuid";

const NewProfilePic = ({ setParentContentURL }) => {
  const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_TOKEN;
  const [image, setImage] = useState(null);
  const [contentType, setContentType] = useState("");
  const [contentUrl, setContentUrl] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  !NFT_STORAGE_TOKEN && console.error("NFT_STORAGE_TOKEN does not exist, this call will fail");

  const captureFile = event => {
    console.log("capturing file...");
    const file = event.target.files[0];
    const _contentType = mime.getType(file.name);
    setContentType(_contentType);
    const _image = new File([file], file.name, { type: _contentType });
    setImage(_image);
    console.log("end capturing file");
  };

  const uploadPictureToIpfs = async () => {
    let metadata;
    try {
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      setLoading(true);
      metadata = await client.store({
        version: "1.0.0",
        metadata_id: uuidv4(),
        content: "Solarpunks",
        name: "profile pic",
        description: "My profile picture",
        image: image,
        tag: "solarpunks",
        imageMimeType: contentType,
        attributes: [
          {
            traitType: "quest_type",
            value: "solarpunks",
          },
        ],
        appId: "solarpunks",
      });

      if (metadata?.url) {
        // set Url for use in this component
        setContentUrl(metadata.url);
        // set Url for callback in parent component
        setTimeout(() => {
          const url = metadata.url.replace("ipfs://", "https://ipfs.io/ipfs/");
          setParentContentURL(url);
        }, 100);
      } else setError(new Error("unrecognized metadata returned"));
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  error && console.error("error in preparing contentUrl", error);

  return (
    <div className="m-2">
      <Formik
        initialValues={{}}
        onSubmit={async ({}, { setSubmitting }) => {
          setSubmitting(true);
          await uploadPictureToIpfs();
          setSubmitting(false);
        }}
      >
        {({ errors, values, isSubmitting }) => (
          <Form>
            <div className="m-5">
              <div className="m-2">
                <label className="file">
                  <span>Upload a photo</span>
                  <span className="mx-5">
                    <input
                      className="bg-blue-400"
                      type="file"
                      disabled={!!contentUrl}
                      onChange={captureFile}
                    />
                  </span>
                </label>
              </div>
              <div>
                {contentUrl ? (
                  <button disabled={true} className="ProButton" type="submit">
                    DONE
                  </button>
                ) : (
                  <>
                    {isSubmitting ? (
                      <button className="ProButton" disabled={true}>
                        ...Uploading
                      </button>
                    ) : (
                      <button
                        disabled={isSubmitting || loading || !image}
                        className="ProButton"
                        type="submit"
                      >
                        Upload Image
                      </button>
                    )}{" "}
                  </>
                )}
                {contentUrl ? <div>Image successfully upload</div> : <div></div>}
                {error && <div>Image upload error</div>}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewProfilePic;
