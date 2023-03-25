import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Layout } from "../../utils/Layout";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useForgotpasswordMutation } from "../../generated/graphql";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotpasswordMutation();
  return (
    <Layout >
       <Formik
          initialValues={{
            email: "",
           
          }}
          onSubmit={async(values,{setErrors}) => {
             await forgotPassword({
                variables:{
                    email:values.email
                }
             })
             setComplete(true)
          }}
        >
          {({ handleSubmit, errors, touched }) => 
             complete ? (
                <Box>
                  if an account with that email exists, we sent you can email
                </Box>
              ) : (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel htmlFor="email">Email Address</FormLabel>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    variant="filled"
                    validate
                  />
               <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
           
                <Button type="submit" colorScheme="green" width="full" variant="outline">
                  Forgot Password
                </Button>
              </VStack>
            </form>
              )
}
        </Formik>
    </Layout>
  );
};

export default ForgotPassword;
