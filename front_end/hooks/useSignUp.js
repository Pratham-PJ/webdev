import React from 'react'
import {useQueryClient,useMutation} from "@tanstack/react-query"
import { signup } from '../src/lib/api';

const useSignUp = () => {
  const queryClient = useQueryClient();

  const {mutate,isPending,error} = useMutation({
    mutationFn : signup,
    onSuccess:() => queryClient.invalidateQueries({queryKey:["authUser"]}),
  })
  return {isPending,error, signupMutation : mutate}
}

export default useSignUp