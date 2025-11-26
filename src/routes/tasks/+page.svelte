<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Badge } from "$lib/components/ui/badge";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
        CardFooter,
    } from "$lib/components/ui/card";
    import * as Select from "$lib/components/ui/select";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { formatDate, getPriorityColor, getStatusColor } from "$lib/utils";
    import {
        Search,
        Filter,
        ArrowUpDown,
        Calendar,
        Clock,
        MoreHorizontal,
        Pencil,
        Trash2,
        CheckCircle,
        XCircle,
    } from "@lucide/svelte";
    import type { ActionData, PageData } from "./$types";

    let { data, form } = $props<{ data: PageData; form: ActionData }>();

    let loading = $state(false);
    let selectedPriority = $state<string>("");
    let selectedStatus = $state<string>("Pending");
    let searchQuery = $state($page.url.searchParams.get("search") || "");

    // Edit State
    let isEditDialogOpen = $state(false);
    let editingTask = $state<any>(null);
    let editPriority = $state<string>("");
    let editStatus = $state<string>("");

    // Delete State
    let isDeleteDialogOpen = $state(false);
    let deletingTask = $state<any>(null);

    // Reset form state when submission is successful
    $effect(() => {
        if (form?.success) {
            selectedPriority = "";
            selectedStatus = "Pending";
            if (isEditDialogOpen) {
                isEditDialogOpen = false;
                editingTask = null;
            }
            if (isDeleteDialogOpen) {
                isDeleteDialogOpen = false;
                deletingTask = null;
            }
        }
    });

    function updateParams(key: string, value: string | null) {
        const url = new URL($page.url);
        if (value && value !== "all") {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
        goto(url, { keepFocus: true });
    }

    function handleSearch() {
        updateParams("search", searchQuery);
    }

    function openEditDialog(task: any) {
        editingTask = task;
        editPriority = task.priority;
        editStatus = task.status;
        isEditDialogOpen = true;
    }

    function openDeleteDialog(task: any) {
        deletingTask = task;
        isDeleteDialogOpen = true;
    }
</script>

<div class="container mx-auto py-10 px-4 space-y-8">
    <!-- Create Task Form -->
    <div class="max-w-2xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>Add a new task to your list</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    method="POST"
                    action="?/create"
                    use:enhance={() => {
                        loading = true;
                        return async ({ update }) => {
                            loading = false;
                            await update();
                        };
                    }}
                    class="space-y-6"
                >
                    <!-- Title -->
                    <div class="space-y-2">
                        <Label for="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g., Complete project proposal"
                            value={form?.data?.title ?? ""}
                            required
                            disabled={loading}
                        />
                        {#if form?.errors?.title}
                            <p class="text-sm text-red-600">
                                {form.errors.title[0]}
                            </p>
                        {/if}
                    </div>

                    <!-- Description -->
                    <div class="space-y-2">
                        <Label for="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Add details about your task..."
                            value={form?.data?.description ?? ""}
                            disabled={loading}
                        />
                        {#if form?.errors?.description}
                            <p class="text-sm text-red-600">
                                {form.errors.description[0]}
                            </p>
                        {/if}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Priority -->
                        <div class="space-y-2">
                            <Label>Priority</Label>
                            <Select.Root
                                type="single"
                                bind:value={selectedPriority}
                            >
                                <Select.Trigger disabled={loading}>
                                    {selectedPriority || "Select priority"}
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="Low">Low</Select.Item>
                                    <Select.Item value="Medium"
                                        >Medium</Select.Item
                                    >
                                    <Select.Item value="High">High</Select.Item>
                                </Select.Content>
                            </Select.Root>
                            <input
                                type="hidden"
                                name="priority"
                                value={selectedPriority}
                            />
                            {#if form?.errors?.priority}
                                <p class="text-sm text-red-600">
                                    {form.errors.priority[0]}
                                </p>
                            {/if}
                        </div>

                        <!-- Status -->
                        <div class="space-y-2">
                            <Label>Status</Label>
                            <Select.Root
                                type="single"
                                bind:value={selectedStatus}
                            >
                                <Select.Trigger disabled={loading}>
                                    {selectedStatus || "Select status"}
                                </Select.Trigger>
                                <Select.Content>
                                    <Select.Item value="Pending"
                                        >Pending</Select.Item
                                    >
                                    <Select.Item value="In Progress"
                                        >In Progress</Select.Item
                                    >
                                    <Select.Item value="Completed"
                                        >Completed</Select.Item
                                    >
                                </Select.Content>
                            </Select.Root>
                            <input
                                type="hidden"
                                name="status"
                                value={selectedStatus}
                            />
                            {#if form?.errors?.status}
                                <p class="text-sm text-red-600">
                                    {form.errors.status[0]}
                                </p>
                            {/if}
                        </div>
                    </div>

                    <!-- Due Date -->
                    <div class="space-y-2">
                        <Label for="due_date">Due Date</Label>
                        <Input
                            id="due_date"
                            name="due_date"
                            type="date"
                            value={form?.data?.due_date ?? ""}
                            required
                            disabled={loading}
                        />
                        {#if form?.errors?.due_date}
                            <p class="text-sm text-red-600">
                                {form.errors.due_date[0]}
                            </p>
                        {/if}
                    </div>

                    <!-- Error Message -->
                    {#if form?.error}
                        <div
                            class="rounded-md bg-red-50 p-3 text-sm text-red-800"
                        >
                            {form.message || form.error}
                        </div>
                    {/if}

                    <!-- Success Message -->
                    {#if form?.success}
                        <div
                            class="rounded-md bg-green-50 p-3 text-sm text-green-800"
                        >
                            {form.message}
                        </div>
                    {/if}

                    <div class="flex justify-end space-x-4">
                        <Button variant="outline" href="/" disabled={loading}
                            >Cancel</Button
                        >
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Add Task"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>

    <div class="border-t pt-8">
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
            <h2 class="text-2xl font-bold">Your Tasks</h2>

            <div class="flex flex-wrap gap-2 w-full md:w-auto">
                <!-- Search -->
                <div class="relative w-full md:w-64">
                    <Search
                        class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        placeholder="Search tasks..."
                        class="pl-8"
                        bind:value={searchQuery}
                        oninput={handleSearch}
                    />
                </div>

                <!-- Filter Status -->
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="outline" size="icon">
                            <Filter class="h-4 w-4" />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Filter by Status</DropdownMenu.Label
                        >
                        <DropdownMenu.Separator />
                        <DropdownMenu.RadioGroup
                            value={$page.url.searchParams.get("status") ||
                                "all"}
                            onValueChange={(v) => updateParams("status", v)}
                        >
                            <DropdownMenu.RadioItem value="all"
                                >All Statuses</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="Pending"
                                >Pending</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="In Progress"
                                >In Progress</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="Completed"
                                >Completed</DropdownMenu.RadioItem
                            >
                        </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>

                <!-- Sort -->
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="outline" size="icon">
                            <ArrowUpDown class="h-4 w-4" />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Label>Sort by</DropdownMenu.Label>
                        <DropdownMenu.Separator />
                        <DropdownMenu.RadioGroup
                            value={$page.url.searchParams.get("sort") ||
                                "created_at"}
                            onValueChange={(v) => updateParams("sort", v)}
                        >
                            <DropdownMenu.RadioItem value="created_at"
                                >Created Date</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="due_date"
                                >Due Date</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="priority"
                                >Priority</DropdownMenu.RadioItem
                            >
                        </DropdownMenu.RadioGroup>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Label>Direction</DropdownMenu.Label>
                        <DropdownMenu.RadioGroup
                            value={$page.url.searchParams.get("direction") ||
                                "desc"}
                            onValueChange={(v) => updateParams("direction", v)}
                        >
                            <DropdownMenu.RadioItem value="asc"
                                >Ascending</DropdownMenu.RadioItem
                            >
                            <DropdownMenu.RadioItem value="desc"
                                >Descending</DropdownMenu.RadioItem
                            >
                        </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>

        {#if data.tasks.length === 0}
            <div
                class="text-center py-12 bg-gray-50 rounded-lg border border-dashed"
            >
                <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
                    <Calendar class="h-12 w-12" />
                </div>
                <h3 class="text-lg font-medium text-gray-900">
                    No tasks found
                </h3>
                <p class="text-gray-500 mt-1">
                    {#if searchQuery || $page.url.searchParams.get("status") || $page.url.searchParams.get("priority")}
                        Try adjusting your filters or search query.
                    {:else}
                        Get started by creating a new task above.
                    {/if}
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each data.tasks as task (task.id)}
                    <Card class="flex flex-col h-full relative group">
                        <CardHeader>
                            <div class="flex justify-between items-start gap-2">
                                <div class="flex gap-2">
                                    <Badge
                                        class={getPriorityColor(task.priority)}
                                        variant="outline"
                                    >
                                        {task.priority}
                                    </Badge>
                                    <Badge
                                        class={getStatusColor(task.status)}
                                        variant="outline"
                                    >
                                        {task.status}
                                    </Badge>
                                </div>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="h-8 w-8"
                                        >
                                            <MoreHorizontal class="h-4 w-4" />
                                        </Button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        <DropdownMenu.Item
                                            onclick={() => openEditDialog(task)}
                                        >
                                            <Pencil class="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item
                                            class="text-red-600"
                                            onclick={() =>
                                                openDeleteDialog(task)}
                                        >
                                            <Trash2 class="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </div>
                            <CardTitle class="mt-2 line-clamp-2"
                                >{task.title}</CardTitle
                            >
                            <CardDescription
                                class="flex items-center gap-1 mt-1"
                            >
                                <Clock class="h-3 w-3" />
                                Due {formatDate(task.due_date)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="flex-grow">
                            {#if task.description}
                                <p
                                    class="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap"
                                >
                                    {task.description}
                                </p>
                            {:else}
                                <p class="text-sm text-gray-400 italic">
                                    No description provided
                                </p>
                            {/if}
                        </CardContent>
                        <CardFooter
                            class="flex justify-between items-center border-t pt-4 mt-auto"
                        >
                            <span class="text-xs text-gray-400"
                                >Created {formatDate(task.created_at)}</span
                            >
                            <form
                                method="POST"
                                action="?/toggleStatus"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={task.id}
                                />
                                <input
                                    type="hidden"
                                    name="currentStatus"
                                    value={task.status}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="submit"
                                    title={task.status === "Completed"
                                        ? "Mark Incomplete"
                                        : "Mark Complete"}
                                >
                                    {#if task.status === "Completed"}
                                        <XCircle
                                            class="h-4 w-4 text-gray-500"
                                        />
                                    {:else}
                                        <CheckCircle
                                            class="h-4 w-4 text-green-600"
                                        />
                                    {/if}
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                {/each}
            </div>
        {/if}
    </div>
</div>

<!-- Edit Dialog -->
<Dialog.Root bind:open={isEditDialogOpen}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Edit Task</Dialog.Title>
            <Dialog.Description>
                Make changes to your task here. Click save when you're done.
            </Dialog.Description>
        </Dialog.Header>
        {#if editingTask}
            <form
                method="POST"
                action="?/update"
                use:enhance={() => {
                    loading = true;
                    return async ({ update }) => {
                        loading = false;
                        await update();
                    };
                }}
                class="space-y-4"
            >
                <input type="hidden" name="id" value={editingTask.id} />
                <div class="space-y-2">
                    <Label for="edit-title">Title</Label>
                    <Input
                        id="edit-title"
                        name="title"
                        value={editingTask.title}
                        required
                    />
                </div>
                <div class="space-y-2">
                    <Label for="edit-description">Description</Label>
                    <Textarea
                        id="edit-description"
                        name="description"
                        value={editingTask.description}
                    />
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label>Priority</Label>
                        <Select.Root type="single" bind:value={editPriority}>
                            <Select.Trigger>
                                {editPriority || editingTask.priority}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="Low">Low</Select.Item>
                                <Select.Item value="Medium">Medium</Select.Item>
                                <Select.Item value="High">High</Select.Item>
                            </Select.Content>
                        </Select.Root>
                        <input
                            type="hidden"
                            name="priority"
                            value={editPriority}
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>Status</Label>
                        <Select.Root type="single" bind:value={editStatus}>
                            <Select.Trigger>
                                {editStatus || editingTask.status}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="Pending"
                                    >Pending</Select.Item
                                >
                                <Select.Item value="In Progress"
                                    >In Progress</Select.Item
                                >
                                <Select.Item value="Completed"
                                    >Completed</Select.Item
                                >
                            </Select.Content>
                        </Select.Root>
                        <input type="hidden" name="status" value={editStatus} />
                    </div>
                </div>
                <div class="space-y-2">
                    <Label for="edit-due-date">Due Date</Label>
                    <Input
                        id="edit-due-date"
                        name="due_date"
                        type="date"
                        value={editingTask.due_date}
                        required
                    />
                </div>
                <Dialog.Footer>
                    <Button type="submit" disabled={loading}
                        >Save changes</Button
                    >
                </Dialog.Footer>
            </form>
        {/if}
    </Dialog.Content>
</Dialog.Root>

<!-- Delete Alert Dialog -->
<AlertDialog.Root bind:open={isDeleteDialogOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
            <AlertDialog.Description>
                This action cannot be undone. This will permanently delete the
                task "{deletingTask?.title}".
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={deletingTask?.id} />
                <AlertDialog.Action
                    type="submit"
                    class="bg-red-600 hover:bg-red-700"
                    >Delete</AlertDialog.Action
                >
            </form>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
