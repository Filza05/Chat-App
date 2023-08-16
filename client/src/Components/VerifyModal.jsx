import React, { useState } from "react";

const VerifyModal = ({ showModal, setShowModal, handleSubmit }) => {
  const [verificationCode, setVerificationCode] = useState(null);
  return (
    <div>
      <div
        id="popup-modal"
        tabindex="-1"
        className={`fixed flex ${
          !showModal && "hidden"
        } backdrop-blur-lg flex-col justify-center items-center z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="popup-modal"
              onClick={() => {
                setShowModal(false);
              }}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-6 text-center">
              <h3 className="my-3 text-lg font-normal text-gray-500 dark:text-gray-400">
                A verification code has been sent to your email.
              </h3>
              <p className="text-white">Enter your verification code:</p>
              <input
                required
                type="text"
                className="w-full py-2 my-2 px-4 rounded-md"
                inputMode="numeric"
                onChange={(event) => {
                  setVerificationCode(event.target.value);
                  event.target.value = event.target.value.replace(
                    /[^0-9]/g,
                    ""
                  );
                }}
              />
              <button
                onClick={(event) => {
                  handleSubmit(verificationCode);
                }}
                data-modal-hide="popup-modal"
                type="button"
                className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyModal;
