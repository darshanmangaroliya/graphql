import { Formik, Field } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { MeDocument, MeQuery, useLoginMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/errorformater";

export default function Login() {
    const [login] =  useLoginMutation()
  const navigate = useNavigate()
  return (
    <Flex bg="gray.100" align="center" justify="center" >
      <Box bg="white" p={6} rounded="md" w={"96"} m={6}>
        <Box textAlign="center" color="orange.500" mb="1">
           <Heading>Log In</Heading>
        </Box>
        <Formik
          initialValues={{
            email: "",
            password: "",
            rememberMe: false
          }}
          onSubmit={async(values,{setErrors}) => {
            const response = await login({
                variables:{
                 email:values.email,
                 password:values.password
                  
                },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.login.user,
                    },
                  });
                },
              })

              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                // worked
                navigate("/dashboard");
              }
          }}
        >
          {({ handleSubmit, errors, touched }) => (
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
                <FormControl isInvalid={!!errors.password && touched.password}>
                  <FormLabel htmlFor="password">Password</FormLabel>
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
                <Field
                  as={Checkbox}
                  id="rememberMe"
                  name="rememberMe"
                  colorScheme="purple"
                >
                  Remember me?
                </Field>
                <Button type="submit" colorScheme="green" width="full" variant="outline">
                  Login
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