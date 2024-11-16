import { useRouter } from "next/router";
import ViewPost from "../../components/ui/ViewPost";

export default function ViewPostPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <ViewPost id={id} />
    </>
  );
}
