import { NFTStorage, File } from "nft.storage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import mime from "mime";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import GridLoader from "react-spinners/GridLoader";

const NewPost = ({ setParentContentURL }) => {
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
  };

  const registerPlace = async ({ name, description, tag, location, tokenId, placeType }) => {
    let metadata;
    try {
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      setLoading(true);
      metadata = await client.store({
        version: "1.0.0",
        metadata_id: uuidv4(),
        content: "Solarpunks",
        name,
        description,
        image: image,
        tag: tag,
        imageMimeType: contentType,
        attributes: [
          {
            traitType: "tokenId",
            value: tokenId,
          },
          {
            traitType: "location",
            value: location,
          },
          {
            traitType: "place_type",
            value: placeType,
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
    <div className="">
      <Formik
        initialValues={{
          name: "",
          description: "",
          tag: "",
          tokenId: "",
          location: "",
          placeType: "",
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required field"),
          description: Yup.string(),
          tag: Yup.string(),
          tokenId: Yup.number().integer(),
          location: Yup.string(),
          placeType: Yup.string(),
        })}
        onSubmit={async (
          { name, description, tag, tokenId, placeType, location },
          { setSubmitting },
        ) => {
          setSubmitting(true);
          await registerPlace({
            name,
            description,
            tag,
            tokenId: tokenId.toString(),
            placeType,
            location,
          });
          setSubmitting(false);
        }}
      >
        {({ errors, values, isSubmitting }) => (
          <Form>
            <div className="ProPost">
              {/* Field1 name */}
              <div className="m-2 col-span-3 text-center ">
                  <label className="ProLabel" htmlFor="name">Proposal Title</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="name"
                    name="name"
                    placeholder="Your post in a nutshell"
                    className="ProField"
                  />
                {/* Input Error */}
                {errors?.name && (
                  <div className="">
                    <ErrorMessage name="name" />
                  </div>
                )}
              </div>
              {/* Field2 description */}
              <div className="m-2 col-span-3 text-center" >
                  <label className="ProLabel " htmlFor="description">Add details to your proposal</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    as="textarea"
                    id="description"
                    name="description"
                    placeholder="What are you thinking?"
                    className="ProField"
                  />
                {/* Input Error */}
                {errors?.description && (
                  <div>
                    <ErrorMessage name="description" />
                  </div>
                )}
              </div>

              {/* Field5 placeType */}
              <div className="m-2">
                  <label className="ProLabel" htmlFor="placeType">Select request</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="placeType"
                    name="placeType"
                    placeholder="Choose ⚡💽"
                    className="ProField"
                    as="select"
                  >
                    <option disabled selected className="bg-glass-100">Choose⚡💽</option>
                    <option className="bg-glass-100">⚡ Ask for energy</option>
                    <option className="bg-glass-100">💽 Ask for chips</option>
                  </Field>
                {errors?.placeType && (
                  <div>
                    <ErrorMessage name="placeType" />
                  </div>
                )}
              </div>
              {/* Field3 tag */}
              <div className="m-2">
                  <label className="ProLabel" htmlFor="tag">Units request</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="tag"
                    name="tag"
                    placeholder="0-100"
                    className="ProField"
                  />
                {/* Input Error */}
                {errors?.tag && (
                  <div>
                    <ErrorMessage name="tag" />
                  </div>
                )}
              </div>

              
              {/* Field4 tokenId 
              <div className="m-5">
                  <label className="ProLabel" htmlFor="tokenId">Tag a Lens Friend 🌿</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="tokenId"
                    name="tokenId"
                    placeholder="Paste a Lens friend URL"
                    className="ProField"
                  />
                {errors?.tokenId && (
                  <div>
                    <ErrorMessage name="tokenId" />
                  </div>
                )}
              </div>
              */}
              {/* Field5 location 
              <div className="m-5">
                  <label className="ProLabel" htmlFor="location">Tag a Punk Cities place 🏢</label>
                  <Field
                    disabled={isSubmitting || loading || !!contentUrl}
                    id="location"
                    name="location"
                    placeholder="Paste place URL from Punk Cities"
                    className="ProField"
                  />
                {errors?.location && (
                  <div>
                    <ErrorMessage name="location" />
                  </div>
                )}
              </div>*/}
              
            </div>
            <div>
            <div className="m-5 text-center text-white">
            <div className="mb-10 ">🖼️ Add media to your post!</div>
                <label className="file">
                  <input type="file" disabled={!!contentUrl} onChange={captureFile} />
                </label>
              </div>
              <div className="m-5 text-center">
                {contentUrl ? (
                  <button disabled={true} className="ProButton2" type="submit">
                    DONE
                  </button>
                ) : (
                  <>
                    {isSubmitting ? (
                      <button className="" disabled={true}>
                        <GridLoader color="white"/>
                      </button>
                    ) : (
                      <button
                        disabled={
                          isSubmitting ||
                          loading ||
                          !!errors?.name ||
                          !image ||
                          !values?.name ||
                          !!error?.tokenId
                        }
                        className="ProButton2"
                        type="submit"
                      >
                        Upload Image
                      </button>
                    )}{" "}
                  </>
                )}
                {contentUrl && <div className="ProLabel">Image successfully upload</div>}
                {error && <a class="text-white mt-5">Oops, something failed!</a>}
              </div>
              </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewPost;
