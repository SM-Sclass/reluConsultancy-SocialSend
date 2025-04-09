import React from "react";
import * as z from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw, Loader, Save } from "lucide-react";
import { setFilterId } from "@/store/filterStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown";
import { TagInput } from "@/components/TagInput";
import { filterUsers } from "@/pages/View/Social-Search/Service/Filter.service";
import { useNavigate, useParams } from "react-router";

const filterSchema = z.object({
  social_platform: z
    .array(
      z.enum([
        "Instagram",
        "Twitter",
        "TikTok",
        "LinkedIn",
        "Facebook",
        "YouTube",
      ])
    )
    .nonempty("Select at least one social platform"),
  filter_name: z.string().min(3, "Enter at least 3 characters"),
  hashtag: z.array(z.string()).nonempty("Provide at least one hashtag"),
  gender: z.array(z.enum(["Male", "Female", "Non-Binary", "Other"])).optional(),
  age: z.number().optional(),
  followers: z.number().optional(),
  keywords: z.array(z.string()).nonempty("Provide at least one keyword"),
  following_lists: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
  scrape_limit: z.number().optional(),
  scrape_bulk: z.boolean(),
});

const FilterSidebarLeads = ({ table, setIsOpen, setOpenNewFilter }) => {
  const initialValues = {
    social_platform: [],
    filter_name: "",
    hashtag: [],
    gender: [],
    age: 0,
    followers: 0,
    keywords: [],
    following_lists: [],
    interests: [],
    location: [],
    scrape_limit: 0,
    scrape_bulk: false,
  };

  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: initialValues,
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const filterMutation = useMutation({
    mutationFn: filterUsers,
    onSuccess: (result) => {
      // Store the filter ID returned from the API
      const newFilterId = result.filter_id || "67cd8ea517b104152dc65c26";

      setFilterId(newFilterId);
      //   setIsOpen(false);
      //   navigate("/campaigns");
      setOpenNewFilter(false);

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      queryClient.invalidateQueries({
        queryKey: ["filteredUserAccounts", newFilterId],
      });
    },
    onError: (error) => {
      console.error("Error fetching filtered users:", error);
    },
  });

  const onSubmit = async (data) => {
    try {
      (data.user = "67dbcd214597acae7bdf3f6c"),
        toast.promise(filterMutation.mutateAsync(data), {
          loading: "Saving filter...",
          success: "Filter saved successfully!",
          error: "An error occurred while saving filter",
        });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetFilter = () => {
    // // Reset table selection
    // if (JSON.stringify(form.getValues()) === JSON.stringify(initialValues)) {
    //   table.resetRowSelection();
    //   setFilterId(null);
    //   toast.success("Filters reset successfully!");
    // } else {
    //   form.reset(initialValues);
    //   toast.success("Form reset successfully!");
    // }
    // // Reset filter ID if the form is back to initial state
  };

  return (
    <div className="w-full sm:w-72 sm:border-r sm:border-gray-200 pl-6 pr-5 py-4 h-full overflow-y-auto">
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <div className="flex">
                <Button
                  type="button"
                  className="hover:bg-secondary rounded cursor-pointer w-fit"
                  onClick={handleResetFilter}
                  title="Reset filters"
                  variant="ghost"
                >
                  <RefreshCcw className="w-5 h-5" />
                </Button>
                {/* <Button
                  type="submit"
                  className="hover:bg-secondary rounded text-blue-600 cursor-pointer"
                  title="Apply filters"
                  disabled={filterMutation.isPending}
                  variant="ghost"
                >
                  <Save className="w-5 h-5" />
                </Button> */}
                <div className="p-1 rounded">
                  {filterMutation.isPending ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="social_platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Platform</FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        title="Social Platform"
                        options={[
                          "Instagram",
                          "Twitter",
                          "TikTok",
                          "LinkedIn",
                          "Facebook",
                          "YouTube",
                        ]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                contorl={form.control}
                name="filter_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter Name</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Give your filter a name"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hashtag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hashtag</FormLabel>
                    <FormControl>
                      <TagInput
                        placeholder="Add hashtags (press Enter to add)"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        title="Gender"
                        options={["Male", "Female", "Non-Binary", "Other"]}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                contorl={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="Enter age"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                contorl={form.control}
                name="followers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Followers</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="Enter followers count"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <TagInput
                        placeholder="Add keywords (press Enter to add)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="following_lists"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>following lists</FormLabel>
                    <FormControl>
                      <TagInput
                        placeholder="Add following lists (press Enter to add)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <TagInput
                        placeholder="Add hashtags (press Enter to add)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <TagInput
                        placeholder="Add hashtags (press Enter to add)"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                contorl={form.control}
                name="scrape_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>scrape limit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        placeholder="scrape_limit"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                contorl={form.control}
                name="scrape_bulk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>scrape bulk</FormLabel>
                    <FormControl>
                      <Input
                        // value={field.value}
                        disabled={true}
                        value={false}
                        onChange={field.onChange}
                        placeholder="Give your filter a name"
                      />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button
                type="submit"
                className=" rounded bg-gray-300 hover:bg-gray-400 text-gray-900 cursor-pointer"
                title="Apply filters"
                disabled={filterMutation.isPending}
                variant="ghost"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FilterSidebarLeads;
