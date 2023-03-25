import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MeDocument, MeQuery, useChangepasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/errorformater";
import { useState } from "react";

export default function ChangePassword() {
    const [tokenError, setTokenError] = useState("");
    let { token } = useParams();

    const [changepassword] =  useChangepasswordMutation()
  const navigate = useNavigate()
  return (
    <Flex bg="gray.100" align="center" justify="center" >
      <Box bg="white" p={6} rounded="md" w={"96"} m={6}>
      {tokenError ? (
              <Flex>
                <Box mr={2} style={{ color: "red" }}>
                  {tokenError}
                </Box>
                <Link to="/forgot-password">
                  <ChakraLink>click here to get a new one</ChakraLink>
                </Link>
              </Flex>
            ) : null}
        <Box textAlign="center" color="orange.500" mb="1">
           <Heading>Change Password</Heading>
        </Box>
        <Formik
          initialValues={{
            confirmPassword: "",
            password: "",
          }}
          onSubmit={async(values,{setErrors}) => {
            if(values.password !==values.confirmPassword){
                setErrors({confirmPassword:"password not match"})
                return
              }
            const response = await changepassword({
                variables:{
                 token :token??"",
                 newPassword:values.password
                  
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.changepassword.user,
                    },
                  });
                },
              })

              if (response.data?.changepassword.errors) {
                const errorMap =toErrorMap(response.data.changepassword.errors)
                if ("token" in errorMap) {
                    setTokenError(errorMap.token);
                  }
                  setErrors(errorMap);
              } else if (response.data?.changepassword.user) {
                // worked
                navigate("/dashboard");
              }
          }}
        >
          {({ handleSubmit, errors, touched ,isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="email">password</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={(value: string | any[]) => {
                        let error;
  
                        if (value.length < 6) {
                          error = "Password must contain at least 6 characters";
                        }
  
                        return error;
                      }}
                  />
               <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                  <FormLabel htmlFor="confirmpassword">confirm Password</FormLabel>
                  <Field
                    as={Input}
                    id="confirmpassword"
                    name="confirmPassword"
                    type="password"
                    variant="filled"
                    validate
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              
                <Button type="submit" colorScheme="green" width="full" variant="outline" isLoading={isSubmitting}>
                  Change Password
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
        <Box marginTop="5">
            <Text color="blueviolet.200" as={"a"} display="block">
                <Link to="/register">New user create account</Link>
            </Text>
            <Text color="blueviolet.200"  as={"a"} display="block">
                <Link to="/forgot-password">forgot password</Link>
            </Text>
        </Box>
      </Box>
    </Flex>
  );
}