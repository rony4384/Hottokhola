import React, { useContext } from "react";
import * as Yup from "yup";
import { withFormik, FormikProps, Form } from "formik";
import { closeModal } from "@redq/reuse-modal";
import TextField from "components/text-field/text-field";
import { Button } from "components/button/button";
import { useMutation } from "@apollo/react-hooks";
import { ADD_ADDRESS, UPDATE_ADDRESS } from "graphql/mutation/address";
import { FieldWrapper, Heading } from "./address-card.style";
import { ProfileContext } from "contexts/profile/profile.context";
import { FormattedMessage } from "react-intl";
import { useRouter } from "next/router";

// Shape of form values
interface FormValues {
  id?: number | null;
  name?: string;
  customer_id?: number;
  contact_number?: string;
  address?: string;
  district?: string;
}

// The type of props MyForm receives
interface MyFormProps {
  item?: any | null;
}

// Wrap our form with the using withFormik HoC
const FormEnhancer = withFormik<MyFormProps, FormValues>({
  // Transform outer props into form values
  mapPropsToValues: (props) => {
    return {
      id: props.item.id || null,
      name: props.item.name || "",
      address: props.item.address || "",
      district: props.item.district || "",
      contact_number: props.item.contact_number || "",
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Title is required!"),
    contact_number: Yup.string().required("Contact Number is required!"),
    address: Yup.string().required("Address is required"),
  }),
  handleSubmit: (values) => {
    // do submitting things
  },
});

const UpdateAddress = (props: FormikProps<FormValues> & MyFormProps) => {
  const {
    isValid,
    item,
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,

    handleReset,
    isSubmitting,
  } = props;

  const addressValue = {
    id: values.id,
    customer_id: props.item.profileState.id,
    type: "secondary",
    contact_number: values.contact_number,
    name: values.name,
    address: values.address,
    district: values.district === "Dhaka",
  };
  const { state, dispatch } = useContext(ProfileContext);
  const [district, setDistrict] = React.useState(values.district === "Dhaka");
  const updateDistrict = (e) => {
    setDistrict(e.target.checked);
    let value = e.target.checked ? "Dhaka" : "Others";
    dispatch({
      type: "HANDLE_ON_INPUT_CHANGE",
      payload: { value: value, field: "district" },
    });
  };

  const [addAddressMutation] = useMutation(ADD_ADDRESS);
  const [updateAddressMutation] = useMutation(UPDATE_ADDRESS);
  const router = useRouter();

  const handleSubmit = async (e) => {
    if (isValid) {
      if (item && item.id) {
        const addressData = await updateAddressMutation({
          variables: {
            id: values.id,
            type: "secondary",
            name: values.name,
            contact_number: values.contact_number,
            address: values.address,
            district: district ? "Dhaka" : "Others",
          },
        });
      } else {
        const addressData = await addAddressMutation({
          variables: {
            customer_id: props.item.profileState.id,
            type: "secondary",
            contact_number: values.contact_number,
            name: values.name,
            address: values.address,
            district: district ? "Dhaka" : "Others",
          },
        });
      }
      dispatch({ type: "ADD_OR_UPDATE_ADDRESS", payload: addressValue });
      e.preventDefault();
      closeModal();
      // router.reload();
    }
  };
  return (
    <Form onSubmit={(e) => handleSubmit(e)}>
      <Heading>{item && item.id ? "Edit Address" : "Add New Address"}</Heading>
      <FieldWrapper>
        <TextField
          id="name"
          type="text"
          placeholder="Enter Title"
          error={touched.name && errors.name}
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </FieldWrapper>

      {/* <FieldWrapper>
        <TextField
          id="contact_number"
          type="text"
          placeholder="Enter Contact Number"
          error={touched.contact_number && errors.contact_number}
          value={values.contact_number}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </FieldWrapper> */}

      <FieldWrapper>
        <TextField
          id="address"
          as="textarea"
          placeholder="Enter Address"
          error={touched.address && errors.address}
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
      </FieldWrapper>

      {/* <FieldWrapper>
        <label htmlFor="district">
          Inside Dhaka?
          <input
            type="checkbox"
            id="district"
            checked={district}
            onChange={(e) => updateDistrict(e)}
          />
          <div />
        </label>
      </FieldWrapper> */}

      <Button
        // onClick={handleSubmit}
        type="submit"
        style={{ width: "100%", height: "44px" }}
      >
        <FormattedMessage id="savedAddressId" defaultMessage="Save Address" />
      </Button>
    </Form>
  );
};

export default FormEnhancer(UpdateAddress);
