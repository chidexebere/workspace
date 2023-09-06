import { CheckIcon } from '@heroicons/react/solid';
import { Controller, useForm } from 'react-hook-form';
import Button from '../Button';

interface EditBoardProps {
  title: string;
  bgColor: string;
  backgroundColors: string[];
  onChange: (value: string) => void;
  handleBgColorSelection: (value: string) => void;
  toggleModal: () => void;
  onSubmitHandler: () => void;
}

type FormInputs = {
  title: string;
  bgColor: string;
};

const EditBoard = ({
  title,
  bgColor,
  backgroundColors,
  onChange,
  onSubmitHandler,
  handleBgColorSelection,
  toggleModal,
}: EditBoardProps) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormInputs>();

  return (
    <form className="mb-3 p-4" onSubmit={handleSubmit(onSubmitHandler)}>
      <Controller
        name="title"
        control={control}
        rules={{ required: title ? false : true }}
        render={({ field: { ...field } }) => (
          <input
            {...field}
            type="text"
            onChange={({ target: { value } }) => {
              setValue('title', value, {
                shouldValidate: true,
                shouldDirty: true,
              });
              onChange(value);
            }}
            className="inputClass text-gray-700 bg-white"
            placeholder="Enter board title"
            value={title}
          />
        )}
      />
      {errors.title && (
        <p className="font-medium tracking-wide text-red-500 text-xs mt-1">
          title is required
        </p>
      )}

      <div className="mt-5">
        <h5 className="text-lg font-medium leading-normal text-gray-800">
          Select background color
        </h5>
        <div className="my-3 flex gap-x-2 justify-center">
          <Controller
            control={control}
            name="bgColor"
            rules={{ required: bgColor ? false : true }}
            render={() => (
              <>
                {backgroundColors.map((backgroundColor, index) => (
                  <div key={index}>
                    <Button
                      variant={`${backgroundColor} focus:${backgroundColor} active:${backgroundColor} text-white`}
                      value={backgroundColor}
                      handleClick={() => {
                        setValue('bgColor', backgroundColor, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        handleBgColorSelection(backgroundColor);
                      }}
                    >
                      {backgroundColor === bgColor && (
                        <CheckIcon className="h-6 w-6" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                ))}
              </>
            )}
          />
        </div>
      </div>
      {errors.bgColor && (
        <p className="font-medium tracking-wide text-red-500 text-xs mt-1">
          background color is required
        </p>
      )}

      <div className="mt-20 flex gap-x-3 justify-end">
        <Button
          variant="text-black border border-gray-300"
          handleClick={toggleModal}
        >
          <span className="uppercase">cancel</span>
        </Button>
        <Button variant="bg-teal-500 text-white" type="submit">
          <span className="uppercase">save changes</span>
        </Button>
      </div>
    </form>
  );
};

export default EditBoard;
