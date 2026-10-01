import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CropDialog from "./CropDialog";
import type { AspectOption, CropChoice } from "./cropModel";
import { useAdminT } from "./adminStrings";

// Opens the crop editor when a new file is chosen, then shows the chosen crop
// with a button to adjust it. Cancelling keeps the whole image.
const CropField = ({
  file,
  aspects,
  value,
  onChange,
}: {
  file: File | null;
  aspects: AspectOption[];
  value: CropChoice | null;
  onChange: (choice: CropChoice | null) => void;
}) => {
  const t = useAdminT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onChange(null);
    setOpen(Boolean(file));
    // Only a new file resets the crop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  if (!file) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {value
          ? `${t("crop.summary")} ${value.rect.sw} × ${value.rect.sh} px (${t(value.aspect.label)})`
          : t("crop.none")}
      </p>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        {t("crop.adjust")}
      </Button>
      {open && (
        <CropDialog
          file={file}
          aspects={aspects}
          initial={value}
          onApply={(choice) => {
            onChange(choice);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default CropField;
