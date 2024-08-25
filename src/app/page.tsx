"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import { Send, Filter, User, Mail, IdCard } from "lucide-react";

const schema = z.object({
  data: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed.data);
      } catch {
        return false;
      }
    },
    { message: "Invalid JSON input" }
  ),
  selectedOptions: z.array(z.string()).optional(), // Add this line
});

type FormData = z.infer<typeof schema>;

type ApiResponse = {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
};

type Option = { value: string; label: string };

const options: Option[] = [
  { value: 'alphabets', label: 'Alphabets' },
  { value: 'numbers', label: 'Numbers' },
  { value: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet' },
];

export default function Home() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/bfhl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data.data,
      });
      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <main className="container mx-auto p-4 text-gray-800 dark:text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-4">
          <label htmlFor="data" className="block mb-2">
            Enter JSON data:
          </label>
          <input
            {...register("data")}
            id="data"
            className="w-full p-2 border rounded text-gray-800 dark:text-white bg-white dark:bg-gray-700"
            placeholder='{"data": ["A", "1", "B", "2", "C", "3"]}'
          />
          {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit
        </button>
      </form>

      {apiResponse && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            API Response:
          </h2>
          <Controller
            name="selectedOptions"
            control={control}
            render={({ field }) => (
              <Select<Option,true>
                {...field}
                options={options}
                value={options.filter(option => field.value?.includes(option.value))}
                onChange={(val) => {
                  field.onChange(val);
                  setSelectedOptions(val.map((option) => option.value));
                }}
                className="mb-4 text-gray-800"
                classNamePrefix="select"
              />
            )}
          />
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 pr-0 md:pr-4">
                <h4 className="font-semibold mb-2">Filtered Results:</h4>
                {selectedOptions.includes("numbers") && (
                  <p>Numbers: {apiResponse.numbers.join(", ")}</p>
                )}
                {selectedOptions.includes("alphabets") && (
                  <p>Alphabets: {apiResponse.alphabets.join(", ")}</p>
                )}
                {selectedOptions.includes("highest_lowercase_alphabet") && (
                  <p>
                    Highest Lowercase Alphabet:{" "}
                    {apiResponse.highest_lowercase_alphabet.join(", ")}
                  </p>
                )}
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0 pl-0 md:pl-4 border-t-2 md:border-t-0 md:border-l-2 border-gray-300 dark:border-gray-600 pt-4 md:pt-0">
                <h4 className="font-semibold mb-2">User Details:</h4>
                <p className="flex items-center mb-1">
                  <User className="w-4 h-4 mr-2" />
                  User ID: indhu_veginetti_07102003
                </p>
                <p className="flex items-center mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Email: indhu.vegienti2021@vitstudent.ac.in
                </p>
                <p className="flex items-center">
                  <IdCard className="w-4 h-4 mr-2" />
                  Roll Number: 21BAI1927
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
