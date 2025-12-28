import 'package:civic_pulse/core/map_mode.dart';
import 'package:civic_pulse/core/problem_providers.dart';
import 'package:civic_pulse/core/problems.dart';
import 'package:civic_pulse/core/temp_user_data.dart';
import 'package:civic_pulse/pages/map_page.dart';
import 'package:civic_pulse/widgets/drop_down_field.dart';
import 'package:civic_pulse/widgets/input_field.dart';
import 'package:civic_pulse/widgets/input_label.dart';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:uuid/uuid.dart';

class ReportProblemPage extends StatefulWidget {
  const ReportProblemPage({super.key});

  @override
  State<ReportProblemPage> createState() => _ReportProblemPageState();
}

class _ReportProblemPageState extends State<ReportProblemPage> {
  final TextEditingController titleController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController locationController = TextEditingController();

  LatLng? selectedLatLng;
  String selectedCategory = 'Roads';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        leading: const BackButton(color: Colors.white),
        title: const Text(
          'Report a Problem',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Help improve your city',
              style: TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Describe the issue clearly so authorities can act faster.',
              style: TextStyle(color: Colors.white60),
            ),
            const SizedBox(height: 24),

            InputLabel('Problem Title'),
            InputField(
              controller: titleController,
              hint: 'e.g. Large pothole near main road',
            ),

            const SizedBox(height: 16),

            InputLabel('Category'),
            DropdownField(
              value: selectedCategory,
              items: categories,
              onChanged: (value) {
                setState(() {
                  selectedCategory = value!;
                });
              },
            ),

            const SizedBox(height: 16),

            InputLabel('Description'),
            InputField(
              controller: descriptionController,
              hint: 'Explain the problem in detail',
              maxLines: 4,
            ),

            const SizedBox(height: 16),

            InputField(
              controller: locationController,
              hint: 'Select location from map',
              onSuffixTap: () async {
                final pickedLocation = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const MapPage(mode: MapMode.select),
                  ),
                );

                if (pickedLocation != null) {
                  selectedLatLng = pickedLocation;
                  locationController.text =
                      '${pickedLocation.latitude}, ${pickedLocation.longitude}';
                }
              },
            ),

            const SizedBox(height: 28),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (titleController.text.isEmpty ||
                      descriptionController.text.isEmpty ||
                      selectedLatLng == null) {
                    return;
                  }

                  final problem = Problem(
                    id: const Uuid().v4(),
                    userId: TempUserData.currentUser.id,
                    title: titleController.text,
                    description: descriptionController.text,
                    category: selectedCategory,
                    locationText: locationController.text,
                    latitude: selectedLatLng!.latitude,
                    longitude: selectedLatLng!.longitude,
                    status: ProblemStatus.pending,
                    createdAt: DateTime.now(),
                  );

                  context.read<ProblemsProvider>().addProblem(problem);

                  Navigator.pop(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: const Text(
                  'Submit Report',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
