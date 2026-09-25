import { useState } from "react";

import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { FaFilter } from "react-icons/fa";

import type { Tags } from "../../@types/tags";
import TagBtn from "../../components/TagBtn";

type Props = {
  tags: Tags;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagsModal({
  tags,
  selectedTags,
  setSelectedTags,
}: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className="scrollbar-hide flex items-center gap-1.5 overflow-auto px-1 py-2">
      {/* modal button */}
      <Button
        pill
        size="xs"
        color="alternative"
        className="shrink-0 border-gray-300 px-3.5 font-normal text-gray-500 shadow-xs dark:border-gray-500 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800"
        onClick={() => setOpenModal(true)}
      >
        <FaFilter className="me-1.5" />
        All tags
      </Button>

      {/* hidden tags */}
      {selectedTags
        .filter((tag) => ![...tags.general, ...tags.years].includes(tag))
        .map((tag, index) => (
          <TagBtn
            key={index}
            tag={tag}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        ))}

      {/* visible tags */}
      {[tags.general, tags.years].map((tagGroup, groupIndex) => (
        <div key={groupIndex} className="contents">
          <div className="h-7 border-s border-gray-300 dark:border-gray-500" />

          {tagGroup.map((tag, index) => (
            <TagBtn
              key={index}
              tag={tag}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          ))}
        </div>
      ))}

      {/* modal */}
      <Modal
        dismissible
        size="3xl"
        show={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ModalHeader className="items-center border-b-gray-200">
          Tags
        </ModalHeader>

        <ModalBody>
          {Object.entries(tags).map(
            ([name, tags]) =>
              tags.length > 0 && (
                <div key={name} className="space-y-3 not-first:mt-3">
                  {/* name */}
                  <h3 className="flex items-center gap-1.5 text-xl font-medium capitalize">
                    {name}
                    <Badge
                      color="alternative"
                      className="bg-gray-200 dark:bg-gray-600"
                    >
                      {tags.length}
                    </Badge>
                  </h3>

                  {/* tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag, index) => (
                      <TagBtn
                        key={index}
                        tag={tag}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </ModalBody>

        <ModalFooter className="flex flex-row-reverse p-4">
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Close
          </Button>

          {/* clear selected tags */}
          {selectedTags.length > 0 && (
            <Button color="alternative" onClick={() => setSelectedTags([])}>
              Clear selected ({selectedTags.length})
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
