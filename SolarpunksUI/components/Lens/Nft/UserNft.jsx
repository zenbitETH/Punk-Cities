import { gql, useLazyQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";
import { Formik, Form, Field, ErrorMessage } from "formik";

const UserNft = () => {
  // todo: address will later replace ownerAddress
  const { address } = useMoralis();
  const [query, { data, loading, error }] = useLazyQuery(GET_USERS_NFTS);
  const getNft = () => {
    try {
      query();
    } catch (e) {
      console.error("unexpected error [creatPost]: ", e);
    }
  };

  return (
    <Formik
      initialValues={{ ownerAddress: "", chainId: "", contractAddress: "" }}
      onSubmit={getNft}
    >
      {({ errors }) => (
        <Form>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="ownerAddress">ownerAddress</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="ownerAddress" name="ownerAddress" placeholder="0x3444ecc6425b8cf1bbeb1a0e67d5a3ed51771501" />
            </span>
          </div>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="chainId">chainId</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field id="chainId" name="chainId" placeholder="1" />
            </span>
          </div>
          <div className="m-2">
            <span className="p-2 m-2">
              <label htmlFor="contractAddress">contractAddress</label>
            </span>
            <span className="p-2 m-2 border-2">
              <Field
                id="contractAddress"
                name="contractAddress"
                placeholder="0xdc4a585e02fe47ec2e366a35172d69133baa9306"
              />
            </span>
          </div>
          <button className="bg-blue-500 m-2 p-2 border-2" type="submit">
            Get User Nft
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default UserNft;

const GET_USERS_NFTS = gql`
  query ($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        contractName
        contractAddress
        symbol
        tokenId
        owners {
          amount
          address
        }
        name
        description
        contentURI
        originalContent {
          uri
          metaType
        }
        chainId
        collectionName
        ercType
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;
