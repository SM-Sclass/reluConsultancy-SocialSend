import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Form, FormField, FormLabel, FormItem, FormControl, FormMessage } from './ui/form';
import { Button } from './ui/button';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { TagInput } from './TagInput';

const filterSchema = z.object({
  social_platform: z.array(
    z.enum(['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube'])
  ).nonempty('Select at least one social platform'),
  filter_name: z.string().min(3, 'Enter at least 3 characters'),
  hashtag: z.array(z.string()).nonempty('Provide at least one hashtag'),
  gender: z.array(z.enum(['Male', 'Female', 'Non-Binary', 'Other'])).optional(),
  age: z.number().optional(),
  followers: z.number().optional(),
  keywords: z.array(z.string()).nonempty('Provide at least one keyword'),
  following_lists: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  location: z.array(z.string()).optional(),
})

function FilterForm() {
  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      social_platform: [],
      filter_name: '',
      hashtag: [],
      gender: [],
      age: 0,
      followers: 0,
      keywords: [],
      following_lists: [],
      interests: [],
      location: [],
    }
  })

  const onSubmit = async (data) => {
    try {
      console.log(data)
      // Call API to save filter
    } catch (error) {
      console.error(error)
      
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="social_platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Social Platform</FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      title="Social Platform"
                      options={['Instagram', 'Twitter', 'TikTok', 'LinkedIn', 'Facebook', 'YouTube']}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-start"/>
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
                  <FormMessage className="text-start"/>
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
                  <FormMessage className="text-start"/>
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
                      options={['Male', 'Female', 'Non-Binary', 'Other']}
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="Enter age"
                    />
                  </FormControl>
                  <FormMessage />
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                      placeholder="Enter followers count"
                    />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage className="text-start"/>
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
          </div>
          <Button type="submit">Save Filter</Button>
        </form>
      </Form>
    </div>
  )
}

export default FilterForm