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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MeDocument, MeQuery, useRegisterMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/errorformater";

export default function Register() {
  const [register] =  useRegisterMutation()
  const navigate = useNavigate()
  return (
    <Flex bg="gray.100" align="center" justify="center" pb={2}>
      <Box bg="white" p={6} rounded="md" w={"96"} m={6}>
        <Box textAlign="center" color="orange.500" mb="1">
           <Heading>Register</Heading>
        </Box>
        <Formik
          initialValues={{
            name:"",
            email: "",
            password: "",
            confirmPassword:"",
            rememberMe: false
          }}
          onSubmit={async(values,{setErrors}) => {
            if(values.password !==values.confirmPassword){
              setErrors({confirmPassword:"password not match"})
              return
            }
            const response = await register({
              variables:{
                input:{
                  email:values.email,
                  name:values.name,
                  password:values.password
                }
                
              },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.addUser.user,
                  },
                });
              },
            })
            if (response.data?.addUser.errors) {
              setErrors(toErrorMap(response.data.addUser.errors));
            } else if (response.data?.addUser.user) {
              // worked
              navigate("/dashboard");
            }
          }}
        >
          {({ handleSubmit, errors, touched ,isSubmitting}) => (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel htmlFor="email"> name</FormLabel>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    variant="filled"
                    validate
                  />
               <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>
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
                <FormControl isInvalid={!!errors.confirmPassword && touched.confirmPassword}>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <Field
                    as={Input}
                    id="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    variant="filled"
                    
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
                <Field
                  as={Checkbox}
                  id="rememberMe"
                  name="rememberMe"
                  colorScheme="purple"
                >
                  Remember me?
                </Field>
                <Button type="submit" colorScheme="green" width="full" variant="outline" isLoading ={isSubmitting}>
                  Register
                </Button>
              </VStack>
            </form>
          )}
        </Formik>
        <Box marginTop="5">
            <Text color="blueviolet.200" as={"a"} display="block">
                <Link to="/login">already account ? login</Link>
            </Text>
            {/* <Text color="blueviolet.200"  as={"a"} display="block">
                <Link to="/register">forgot password</Link>
            </Text> */}
        </Box>
      </Box>
    </Flex>
  );
}