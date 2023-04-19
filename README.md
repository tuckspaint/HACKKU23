# HACKKU23

ELI_ is a webapp that takes text/image/video input and generates output at different comprehension levels.

![ELItext](https://user-images.githubusercontent.com/94943097/233203089-2e298e4c-4dc5-4b22-bc10-d7bb409d7ab1.png)

Text input that is given to ELI_ is stored in a MongoDB Atlas database so that repeated queries do not use additional tokens.
The responses can also be liked or disliked so that inaccurate responses can be removed from the database based on user feedback.

![ELIdatabase](https://user-images.githubusercontent.com/94943097/233204726-8e5b037e-e1ab-4e5e-b6a5-4491ad23079d.png)

ELI_'s responses are generated using OpenAI API to generate output, and Google Cloud Vision, Storage, and Video Intelligence APIs are used to 
generate transcripts of images and videos.

This project was submitted for HackKU23. The theme this year was "Accessibility," with the primary focus being on the accessibility of software and information.
We felt that being able to explain concepts in different comprehension levels would allow users to more easily access any information they wanted more clarity on,
while not lowering the comprehension too much to be unhelpful.

ELI_ could be used by any individual who wants a different explaination of a topic or concept. A parent or an individual working in the education field could use ELI_
to more easily explain complicated concepts to younger individuals who need a lower-level explaination. Students can use the image-to-text feature to get explainations
of their textbook, or they can use the video-to-text feature to get explainations of entire lectures.

Future improvements we can implement include enhancing the UI, hosting the webapp, upgrading the database logic to merge similar inputs, and updating the image
processing feature to lessen the likelihood of "junk" text being found.
